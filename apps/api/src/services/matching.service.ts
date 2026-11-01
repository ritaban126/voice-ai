// PURPOSE: finds the best workers for a request. Filters (skill, available, inside their radius, free at that time),
// scores them (nearest + fair rate + good rating), and saves the top 3 as PROPOSED matches. Rank 1 is auto-selected on the map.
import { db, workerProfiles, matches, jobRequests, and, eq, gt, inArray, lt, notInArray, sql } from '@repo/db';
import { PRICE_BANDS, isWithinBand, type JobType, type SkillId } from '@repo/shared';
import { haversineKm, round1 } from '../lib/geo';
import { hourIST, type TimeWindow } from '../lib/time';
import type { JobRequest, WorkerProfile } from '../types';
import { previewPrice } from './pricing.service';

export interface Candidate {
  worker: WorkerProfile;
  distanceKm: number;
  score: number;
}

const BUSY_NOW = ['ACCEPTED', 'ON_THE_WAY', 'ARRIVED'] as const; // worker is on another job right now
const BUSY_ANY = ['SENT', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED'] as const;

// 1 = cheapest fair rate, 0.5 = most expensive fair rate, 0.3 = outside the normal range
function rateFit(request: JobRequest, w: WorkerProfile): number {
  if (request.jobType === 'LONG_TERM') {
    if (!request.offeredSalary || !w.expectedSalary) return 0.7;
    return Math.min(1, request.offeredSalary / w.expectedSalary); // offer covers what the worker expects -> 1
  }
  const skill = request.skill as SkillId;
  const band = PRICE_BANDS[skill].serviceCharge;
  if (!band || !isWithinBand(skill, 'serviceCharge', w.serviceCharge)) return 0.3;
  return 1 - 0.5 * ((w.serviceCharge - band.min) / Math.max(1, band.max - band.min));
}

async function busyWorkerIds(workerIds: string[], mode: JobType, window: TimeWindow | null): Promise<Set<string>> {
  if (workerIds.length === 0) return new Set();
  if (mode === 'SCHEDULED' && window) {
    // booked for an overlapping time slot
    const rows = await db
      .select({ workerId: matches.workerId })
      .from(matches)
      .innerJoin(jobRequests, eq(matches.requestId, jobRequests.id))
      .where(
        and(
          inArray(matches.workerId, workerIds),
          inArray(matches.status, [...BUSY_ANY]),
          lt(jobRequests.windowStart, window.end),
          gt(jobRequests.windowEnd, window.start),
        ),
      );
    return new Set(rows.map((r) => r.workerId));
  }
  const rows = await db
    .select({ workerId: matches.workerId })
    .from(matches)
    .where(and(inArray(matches.workerId, workerIds), inArray(matches.status, [...BUSY_NOW])));
  return new Set(rows.map((r) => r.workerId));
}

export async function findCandidates(
  request: JobRequest,
  opts: { exclude?: string[]; window?: TimeWindow | null; mode?: JobType } = {},
): Promise<Candidate[]> {
  const mode = opts.mode ?? (request.jobType as JobType);
  const conds = [eq(workerProfiles.profileStatus, 'READY'), sql`${request.skill} = ANY(${workerProfiles.skills})`];
  if (mode !== 'SCHEDULED') conds.push(eq(workerProfiles.available, true)); // "Aaj kaam chahiye" toggle (not used for tomorrow bookings)
  if (opts.exclude?.length) conds.push(notInArray(workerProfiles.id, opts.exclude));

  const workers = await db.select().from(workerProfiles).where(and(...conds));
  const busy = await busyWorkerIds(workers.map((w) => w.id), mode, opts.window ?? null);

  const out: Candidate[] = [];
  for (const w of workers) {
    if (w.lat == null || w.lng == null || busy.has(w.id)) continue;
    if (mode === 'SCHEDULED' && opts.window) {
      // the slot must fit inside the worker's working hours
      if (w.workStartHour > hourIST(opts.window.start) || w.workEndHour < hourIST(opts.window.end)) continue;
    }
    const distanceKm = haversineKm(request.lat, request.lng, w.lat, w.lng);
    const radius = mode === 'LONG_TERM' ? Math.max(w.serviceRadiusKm, 15) : w.serviceRadiusKm;
    if (distanceKm > radius) continue;

    const proximity = Math.max(0, 1 - distanceKm / radius);
    const rating = w.ratingCount > 0 ? w.ratingAvg / 5 : 0.6; // new workers get a fair neutral score
    const score = 0.5 * proximity + 0.25 * rateFit(request, w) + 0.25 * rating;
    out.push({ worker: w, distanceKm, score });
  }
  return out.sort((a, b) => b.score - a.score || a.distanceKm - b.distanceKm);
}

// Saves the next `count` best workers (not yet shown for this request) as PROPOSED, with rank 1,2,3...
export async function proposeWorkers(request: JobRequest, count = 3) {
  const existing = await db.select({ workerId: matches.workerId, rank: matches.rank }).from(matches).where(eq(matches.requestId, request.id));
  const window = request.windowStart && request.windowEnd ? { start: request.windowStart, end: request.windowEnd } : null;
  const top = (await findCandidates(request, { exclude: existing.map((e) => e.workerId), window })).slice(0, count);
  if (top.length === 0) return [];

  let rank = Math.max(0, ...existing.map((e) => e.rank));
  const rows = await db
    .insert(matches)
    .values(
      top.map((c) => {
        rank += 1;
        const price = previewPrice(c.worker, request); // price shown on the card
        return {
          requestId: request.id,
          workerId: c.worker.id,
          rank,
          score: c.score,
          distanceKm: round1(c.distanceKm),
          status: 'PROPOSED' as const,
          priceModel: price.priceModel,
          quotedAmount: price.quotedAmount ?? null,
          visitCharge: price.visitCharge ?? null,
        };
      }),
    )
    .returning();
  await db.update(jobRequests).set({ status: 'PROPOSED' }).where(eq(jobRequests.id, request.id));
  return rows;
}

// "Nobody now, but N people are free tomorrow morning"
export async function countAvailableInWindow(request: JobRequest, window: TimeWindow): Promise<number> {
  return (await findCandidates(request, { mode: 'SCHEDULED', window })).length;
}
