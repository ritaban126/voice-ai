// PURPOSE: the employer's job request. Creates it from what they said, runs the worker search in the background,
// tells the employer when workers are found (or none), and builds the map view (proposed workers).
import { db, jobRequests, matches, workerProfiles, user as users, and, asc, desc, eq, inArray, notInArray } from '@repo/db';
import { SKILLS, needsInspection, type EmployerRequestDraft, type JobType } from '@repo/shared';
import { conflict, forbidden, notFound } from '../lib/errors';
import { resolveWindow, tomorrowWindowIST, type TimeWindow } from '../lib/time';
import type { JobRequest } from '../types';
import { countAvailableInWindow, proposeWorkers } from './matching.service';
import { notify } from './notify.service';
import { jobSizeFromHours } from './pricing.service';

export async function getRequest(requestId: string): Promise<JobRequest> {
  const [r] = await db.select().from(jobRequests).where(eq(jobRequests.id, requestId)).limit(1);
  if (!r) throw notFound('Request');
  return r;
}
async function getOwnRequest(requestId: string, employerId: string): Promise<JobRequest> {
  const r = await getRequest(requestId);
  if (r.employerId !== employerId) throw forbidden();
  return r;
}

// Saves what the employer asked for. Maid / nurse are always LONG_TERM; "kal subah" makes it SCHEDULED.
export async function createRequest(p: { employerId: string; draft: EmployerRequestDraft; lat: number; lng: number; transcript?: string }) {
  const { draft } = p;
  let jobType: JobType = SKILLS[draft.skill].mode === 'LONG_TERM' ? 'LONG_TERM' : draft.jobType === 'LONG_TERM' ? 'ON_DEMAND' : draft.jobType;
  if (jobType === 'ON_DEMAND' && resolveWindow(draft.whenText)) jobType = 'SCHEDULED';
  const window: TimeWindow | null = jobType === 'SCHEDULED' ? (resolveWindow(draft.whenText) ?? tomorrowWindowIST()) : null;

  const [row] = await db
    .insert(jobRequests)
    .values({
      employerId: p.employerId,
      skill: draft.skill,
      jobType,
      rawTranscript: p.transcript ?? null,
      addressNote: draft.addressNote ?? null,
      lat: p.lat,
      lng: p.lng,
      whenText: draft.whenText ?? null,
      windowStart: window?.start ?? null,
      windowEnd: window?.end ?? null,
      durationMonths: jobType === 'LONG_TERM' ? (draft.durationMonths ?? null) : null,
      offeredSalary: jobType === 'LONG_TERM' ? (draft.offeredSalary ?? null) : null,
      startDate: jobType === 'LONG_TERM' ? new Date() : null,
      description: draft.description ?? null,
      estimatedHours: draft.estimatedHours ?? null,
      jobSize: jobType === 'LONG_TERM' ? null : jobSizeFromHours(draft.estimatedHours),
      pricingType: needsInspection(draft.skill) ? 'INSPECTION_NEEDED' : 'FIXED',
      status: 'SEARCHING',
    })
    .returning();
  return row!;
}

// Search runs in the background. The employer is told through a notification (SSE) when it ends.
export function startSearch(requestId: string): void {
  void runSearch(requestId).catch((err) => console.error('[search] failed', err));
}

async function runSearch(requestId: string) {
  const request = await getRequest(requestId);
  const found = await proposeWorkers(request, 3);
  if (found.length > 0) {
    await notify(request.employerId, {
      type: 'WORKERS_FOUND',
      title: 'Workers found',
      body: `${found.length} worker(s) found near you`,
      data: { requestId, replyKey: 'workersFound' },
    });
  } else {
    await handleNoMatch(request);
  }
}

// Nobody found. For "abhi" jobs, check who is free tomorrow morning and offer that.
export async function handleNoMatch(request: JobRequest) {
  let suggestion: { count: number; windowStart: Date; windowEnd: Date } | null = null;
  if (request.jobType === 'ON_DEMAND') {
    const w = tomorrowWindowIST();
    const count = await countAvailableInWindow(request, w);
    if (count > 0) suggestion = { count, windowStart: w.start, windowEnd: w.end };
  }
  await db.update(jobRequests).set({ status: 'NO_MATCH' }).where(eq(jobRequests.id, request.id));
  await notify(request.employerId, {
    type: 'NO_WORKER',
    title: 'No worker available',
    body: suggestion ? `${suggestion.count} worker(s) are free tomorrow morning` : 'No worker is available right now',
    data: { requestId: request.id, replyKey: 'noWorkerNow', suggestion },
  });
}

// What the map screen shows: the proposed workers (no phone numbers). The first PROPOSED one is auto-selected.
export async function getRequestView(requestId: string, employerId: string) {
  const request = await getOwnRequest(requestId, employerId);
  const rows = await db
    .select({ match: matches, worker: workerProfiles, name: users.name })
    .from(matches)
    .innerJoin(workerProfiles, eq(matches.workerId, workerProfiles.id))
    .innerJoin(users, eq(workerProfiles.userId, users.id))
    .where(and(eq(matches.requestId, requestId), notInArray(matches.status, ['EMPLOYER_REJECTED', 'REJECTED', 'EXPIRED', 'CANCELLED'])))
    .orderBy(asc(matches.rank));

  const firstProposed = rows.find((r) => r.match.status === 'PROPOSED')?.match.id;
  return {
    request,
    workers: rows.map((r) => ({
      matchId: r.match.id,
      workerId: r.worker.id,
      name: r.name,
      skills: r.worker.skills,
      rank: r.match.rank,
      status: r.match.status,
      autoSelected: r.match.id === firstProposed,
      distanceKm: r.match.distanceKm,
      ratingAvg: r.worker.ratingAvg,
      ratingCount: r.worker.ratingCount,
      serviceCharge: r.worker.serviceCharge,
      price: { priceModel: r.match.priceModel, quotedAmount: r.match.quotedAmount, visitCharge: r.match.visitCharge },
      lat: r.worker.lat, // map pin
      lng: r.worker.lng,
    })),
  };
}

export const listRequests = (employerId: string) =>
  db.select().from(jobRequests).where(eq(jobRequests.employerId, employerId)).orderBy(desc(jobRequests.createdAt)).limit(50);

// "Nobody now" -> employer accepts tomorrow morning: same request becomes SCHEDULED and the search runs again.
export async function reschedule(requestId: string, employerId: string, window?: TimeWindow) {
  const request = await getOwnRequest(requestId, employerId);
  if (!['NO_MATCH', 'PROPOSED', 'SEARCHING'].includes(request.status)) throw conflict('CANNOT_RESCHEDULE');
  const live = await db
    .select({ id: matches.id })
    .from(matches)
    .where(and(eq(matches.requestId, requestId), inArray(matches.status, ['SENT', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED'])));
  if (live.length) throw conflict('ORDER_IN_PROGRESS', 'A worker is already on this request');

  const w = window ?? tomorrowWindowIST();
  // Old proposals were for the "now" search. Delete them so the same workers can be proposed again for the new time slot.
  await db.delete(matches).where(and(eq(matches.requestId, requestId), eq(matches.status, 'PROPOSED')));
  await db
    .update(jobRequests)
    .set({ jobType: 'SCHEDULED', windowStart: w.start, windowEnd: w.end, status: 'SEARCHING' })
    .where(eq(jobRequests.id, requestId));
  startSearch(requestId);
}

export async function cancelRequest(requestId: string, employerId: string) {
  await getOwnRequest(requestId, employerId);
  const started = await db
    .select({ id: matches.id })
    .from(matches)
    .where(and(eq(matches.requestId, requestId), inArray(matches.status, ['ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'ACTIVE'])));
  if (started.length) throw conflict('ORDER_IN_PROGRESS', 'Cancel the order instead');
  await db.update(matches).set({ status: 'CANCELLED' }).where(and(eq(matches.requestId, requestId), inArray(matches.status, ['PROPOSED', 'SENT'])));
  await db.update(jobRequests).set({ status: 'CANCELLED' }).where(eq(jobRequests.id, requestId));
}
