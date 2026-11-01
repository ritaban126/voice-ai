// PURPOSE: worker and employer profiles. Builds a worker profile from what they said (async), saves employer home location,
// and handles rate / availability / settings changes with price-band checks.
import {
  db, workerProfiles, employerProfiles, areas, user as users, eq,
} from '@repo/db';
import {
  PRICE_BANDS, clampToBand, isLongTerm, isWithinBand, suggestValue,
  type PriceField, type SkillId, type WorkerProfileDraft,
} from '@repo/shared';
import { AppError, conflict, notFound } from '../lib/errors';
import { notify } from './notify.service';
import type { Area, EmployerProfile, SessionUser, WorkerProfile } from '../types';

/* ---------------- lookups ---------------- */
export async function getWorkerByUser(userId: string): Promise<WorkerProfile | null> {
  const [w] = await db.select().from(workerProfiles).where(eq(workerProfiles.userId, userId)).limit(1);
  return w ?? null;
}
export async function requireWorker(userId: string): Promise<WorkerProfile> {
  const w = await getWorkerByUser(userId);
  if (!w || w.skills.length === 0) throw new AppError(409, 'PROFILE_MISSING', 'Create your worker profile first');
  return w;
}
export async function getEmployerProfile(userId: string): Promise<EmployerProfile | null> {
  const [e] = await db.select().from(employerProfiles).where(eq(employerProfiles.userId, userId)).limit(1);
  return e ?? null;
}

// Finds a known area whose name appears in the text ("Durgachowk ke paas" -> Durgachowk)
export async function resolveArea(text?: string | null): Promise<Area | null> {
  if (!text) return null;
  const t = text.toLowerCase();
  const all = await db.select().from(areas);
  return all.find((a) => t.includes(a.name.toLowerCase())) ?? null;
}

/* ---------------- worker: create from voice ---------------- */
// Price the worker asked for, kept inside the allowed band; if they said nothing, the app suggests one.
function pickPrice(skill: SkillId, field: PriceField, requested?: number): number | null {
  if (!PRICE_BANDS[skill][field]) return null;
  return requested != null ? clampToBand(skill, field, requested) : suggestValue(skill, field);
}

// Saves the profile as PENDING and returns at once. The rest (area, price, location) is finished in the background, then PROFILE_READY is sent.
export async function upsertWorkerProfile(
  user: SessionUser,
  draft: WorkerProfileDraft,
  opts: { lat?: number; lng?: number; transcript?: string } = {},
) {
  const existing = await getWorkerByUser(user.id);
  const base = { skills: draft.skills, profileStatus: 'PENDING', originalTranscript: opts.transcript ?? null };
  if (existing) await db.update(workerProfiles).set(base).where(eq(workerProfiles.id, existing.id));
  else await db.insert(workerProfiles).values({ userId: user.id, ...base });

  void finalizeWorkerProfile(user, draft, opts).catch((err) => console.error('[profile] finalize failed', err));
  return { profileStatus: 'PENDING' as const };
}

async function finalizeWorkerProfile(
  user: SessionUser,
  draft: WorkerProfileDraft,
  opts: { lat?: number; lng?: number; transcript?: string },
) {
  const skill = draft.skills[0] as SkillId; // first skill is the main one for prices
  const area = (await resolveArea(draft.areaText)) ?? (await resolveArea(opts.transcript));
  const longTerm = isLongTerm(skill);

  await db
    .update(workerProfiles)
    .set({
      areaId: area?.id ?? null,
      lat: opts.lat ?? area?.lat ?? null, // phone GPS first, else the area's point
      lng: opts.lng ?? area?.lng ?? null,
      serviceCharge: longTerm ? 0 : (pickPrice(skill, 'serviceCharge', draft.serviceCharge) ?? 0),
      dailyRate: longTerm ? null : pickPrice(skill, 'dailyRate', draft.dailyRate),
      expectedSalary: longTerm ? pickPrice(skill, 'monthlySalary', draft.expectedSalary) : null,
      available: true, // they came to find work, so start visible (they can switch it off)
      profileStatus: 'READY',
    })
    .where(eq(workerProfiles.userId, user.id));

  await notify(user.id, { type: 'PROFILE_READY', title: 'Profile ready', body: 'Your profile is ready. You can get work now.' });
}

/* ---------------- worker: settings ---------------- */
// Rate change. Must stay inside the allowed range for the worker's skill. Only new orders use it (old orders keep their locked price).
export async function updateWorkerPricing(
  userId: string,
  input: { serviceCharge?: number; dailyRate?: number; expectedSalary?: number },
) {
  const w = await requireWorker(userId);
  const skill = w.skills[0] as SkillId;
  const checks: [PriceField, number | undefined][] = [
    ['serviceCharge', input.serviceCharge],
    ['dailyRate', input.dailyRate],
    ['monthlySalary', input.expectedSalary],
  ];
  for (const [field, value] of checks) {
    if (value == null) continue;
    const band = PRICE_BANDS[skill][field];
    if (!band) throw new AppError(422, 'OUT_OF_BAND', `${field} is not used for ${skill}`);
    if (!isWithinBand(skill, field, value)) throw new AppError(422, 'OUT_OF_BAND', `Allowed range is Rs ${band.min} to Rs ${band.max}`);
  }
  await db
    .update(workerProfiles)
    .set({
      ...(input.serviceCharge != null && { serviceCharge: input.serviceCharge }),
      ...(input.dailyRate != null && { dailyRate: input.dailyRate }),
      ...(input.expectedSalary != null && { expectedSalary: input.expectedSalary }),
    })
    .where(eq(workerProfiles.id, w.id));
  return requireWorker(userId);
}

export async function setAvailability(userId: string, available: boolean) {
  const w = await requireWorker(userId);
  await db.update(workerProfiles).set({ available }).where(eq(workerProfiles.id, w.id));
  return available;
}

export async function updateWorkerSettings(
  userId: string,
  patch: { upiId?: string; workStartHour?: number; workEndHour?: number; serviceRadiusKm?: number; lat?: number; lng?: number },
) {
  const w = await requireWorker(userId);
  if (patch.workStartHour != null && patch.workEndHour != null && patch.workStartHour >= patch.workEndHour) {
    throw new AppError(422, 'BAD_HOURS', 'Work start must be before work end');
  }
  await db.update(workerProfiles).set(patch).where(eq(workerProfiles.id, w.id));
  return requireWorker(userId);
}

// Live location while the worker is travelling (also fine to call any time)
export async function updateLiveLocation(userId: string, lat: number, lng: number) {
  const w = await requireWorker(userId);
  await db.update(workerProfiles).set({ lastLat: lat, lastLng: lng, lastLocationAt: new Date() }).where(eq(workerProfiles.id, w.id));
}

/* ---------------- employer ---------------- */
export async function ensureEmployerProfile(
  userId: string,
  data: { lat: number; lng: number; addressNote?: string },
) {
  const values = { lat: data.lat, lng: data.lng, addressNote: data.addressNote ?? null, profileStatus: 'READY' };
  const existing = await getEmployerProfile(userId);
  if (existing) await db.update(employerProfiles).set(values).where(eq(employerProfiles.id, existing.id));
  else await db.insert(employerProfiles).values({ userId, ...values });
}

// Where is the employer's home? Phone GPS first, then saved home, then a known area named in what they said.
export async function resolveEmployerLocation(
  userId: string,
  input: { lat?: number; lng?: number; addressNote?: string },
): Promise<{ lat: number; lng: number }> {
  if (input.lat != null && input.lng != null) return { lat: input.lat, lng: input.lng };
  const saved = await getEmployerProfile(userId);
  if (saved?.lat != null && saved.lng != null) return { lat: saved.lat, lng: saved.lng };
  const area = await resolveArea(input.addressNote);
  if (area) return { lat: area.lat, lng: area.lng };
  throw new AppError(422, 'LOCATION_REQUIRED', 'Please allow location access so we can find workers near you');
}

/* ---------------- /me helpers ---------------- */
export async function profileInfo(user: SessionUser): Promise<{ hasProfile: boolean; profileStatus: string | null }> {
  if (user.role === 'WORKER') {
    const w = await getWorkerByUser(user.id);
    return { hasProfile: !!w && w.skills.length > 0, profileStatus: w?.profileStatus ?? null };
  }
  if (user.role === 'EMPLOYER') {
    const e = await getEmployerProfile(user.id);
    return { hasProfile: !!e, profileStatus: e?.profileStatus ?? null };
  }
  return { hasProfile: false, profileStatus: null };
}

// Role can be chosen once. Language can change any time.
export async function onboardUser(user: SessionUser, input: { lang: string; role: string }) {
  if (user.role && user.role !== input.role) throw conflict('ROLE_LOCKED', 'Role cannot be changed');
  const [row] = await db.update(users).set({ lang: input.lang, role: input.role, updatedAt: new Date() }).where(eq(users.id, user.id)).returning({ id: users.id });
  if (!row) throw notFound('User');
}

export async function updatePreferences(userId: string, patch: { lang?: string; voiceReplies?: boolean }) {
  await db.update(users).set({ ...patch, updatedAt: new Date() }).where(eq(users.id, userId));
}
