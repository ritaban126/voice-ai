// PURPOSE: the numbers on the dashboard Home page (only amounts and counts, no graphs):
// worker = orders got, rating, money earned; employer = orders made, money spent. Today / this week / this month in IST.
import { db, matches, payments, jobRequests, workerProfiles, and, eq, gte, inArray, sql } from '@repo/db';
import type { OrderStatus } from '@repo/shared';
import { startOfMonthIST, startOfTodayIST, startOfWeekIST } from '../lib/time';
import { requireWorker } from './profile.service';
import type { SessionUser } from '../types';

const COUNTED: OrderStatus[] = ['ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'ACTIVE', 'COMPLETED']; // orders the worker really got

export async function workerStats(user: SessionUser) {
  const w = await requireWorker(user.id);
  const now = new Date();

  const count = async (since: Date) => {
    const [r] = await db
      .select({ c: sql<number>`count(*)::int` })
      .from(matches)
      .where(and(eq(matches.workerId, w.id), inArray(matches.status, COUNTED), gte(matches.acceptedAt, since)));
    return r?.c ?? 0;
  };
  // money the worker confirmed as received
  const earned = async (since: Date) => {
    const [r] = await db
      .select({ s: sql<number>`coalesce(sum(${payments.agreedAmount}), 0)::int` })
      .from(payments)
      .innerJoin(matches, eq(payments.matchId, matches.id))
      .where(and(eq(matches.workerId, w.id), eq(payments.status, 'PAID'), gte(payments.workerConfirmedAt, since)));
    return r?.s ?? 0;
  };
  const [today, month, week$, month$] = await Promise.all([
    count(startOfTodayIST(now)), count(startOfMonthIST(now)), earned(startOfWeekIST(now)), earned(startOfMonthIST(now)),
  ]);
  return {
    orders: { today, month },
    rating: { avg: w.ratingAvg, count: w.ratingCount },
    earnings: { week: week$, month: month$ },
  };
}

export async function employerStats(user: SessionUser) {
  const now = new Date();
  const count = async (since: Date) => {
    const [r] = await db
      .select({ c: sql<number>`count(*)::int` })
      .from(matches)
      .innerJoin(jobRequests, eq(matches.requestId, jobRequests.id))
      .where(and(eq(jobRequests.employerId, user.id), inArray(matches.status, COUNTED), gte(matches.acceptedAt, since)));
    return r?.c ?? 0;
  };
  // money the employer marked as paid (or the worker confirmed received in cash)
  const spent = async (since: Date) => {
    const when = sql`coalesce(${payments.employerMarkedAt}, ${payments.workerConfirmedAt})`;
    const [r] = await db
      .select({ s: sql<number>`coalesce(sum(${payments.agreedAmount}), 0)::int` })
      .from(payments)
      .innerJoin(matches, eq(payments.matchId, matches.id))
      .innerJoin(jobRequests, eq(matches.requestId, jobRequests.id))
      .innerJoin(workerProfiles, eq(matches.workerId, workerProfiles.id))
      .where(and(eq(jobRequests.employerId, user.id), inArray(payments.status, ['EMPLOYER_MARKED_PAID', 'PAID']), sql`${when} >= ${since.toISOString()}`));
    return r?.s ?? 0;
  };
  const [today, month, week$, month$] = await Promise.all([
    count(startOfTodayIST(now)), count(startOfMonthIST(now)), spent(startOfWeekIST(now)), spent(startOfMonthIST(now)),
  ]);
  return { orders: { today, month }, spend: { week: week$, month: month$ } };
}
