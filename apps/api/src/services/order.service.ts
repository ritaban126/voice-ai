// PURPOSE: the order life cycle (state machine). Employer picks a proposed worker -> worker accepts -> on the way -> arrived
// -> (quote if inspection job) -> completed -> payment -> rating. Every status change is checked against shared/orderStatus.
import { db, matches, jobRequests, workerProfiles, payments, user as users, and, desc, eq, inArray, sql } from '@repo/db';
import { canTransition, type CreateOrderInput, type OrderStatus, type QuoteInput } from '@repo/shared';
import { env } from '../env';
import { haversineKm, round1 } from '../lib/geo';
import { badRequest, conflict, forbidden, notFound } from '../lib/errors';
import { monthKeyIST } from '../lib/time';
import type { Match, SessionUser } from '../types';
import { proposeWorkers } from './matching.service';
import { notify } from './notify.service';
import { ensurePayment } from './payment.service';
import { previewPrice, validateQuote } from './pricing.service';
import { handleNoMatch } from './request.service';

const LIVE = ['SENT', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'ACTIVE'] as const;
// Phone numbers are shown only after the worker accepted
const REVEAL: OrderStatus[] = ['ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'ACTIVE', 'COMPLETED'];

/* ---------------- helpers ---------------- */
async function loadMatch(matchId: string) {
  const [row] = await db
    .select({ match: matches, request: jobRequests, worker: workerProfiles })
    .from(matches)
    .innerJoin(jobRequests, eq(matches.requestId, jobRequests.id))
    .innerJoin(workerProfiles, eq(matches.workerId, workerProfiles.id))
    .where(eq(matches.id, matchId))
    .limit(1);
  if (!row) throw notFound('Order');
  return row;
}
type Loaded = Awaited<ReturnType<typeof loadMatch>>;

const assertEmployer = (row: Loaded, u: SessionUser) => { if (row.request.employerId !== u.id) throw forbidden(); };
const assertWorker = (row: Loaded, u: SessionUser) => { if (row.worker.userId !== u.id) throw forbidden(); };

// The only way a status changes. Wrong jumps (for example PROPOSED -> COMPLETED) are refused.
async function changeStatus(row: Loaded, to: OrderStatus, extra: Partial<typeof matches.$inferInsert> = {}): Promise<Match> {
  const from = row.match.status as OrderStatus;
  if (!canTransition(from, to)) throw conflict('BAD_TRANSITION', `Cannot go from ${from} to ${to}`);
  const [updated] = await db.update(matches).set({ status: to, ...extra }).where(eq(matches.id, row.match.id)).returning();
  return updated!;
}

/* ---------------- employer: accept / reject a proposed worker ---------------- */
// Employer taps Accept on the worker's map icon. The order goes to the worker (SENT) and the price is locked from current rates.
export async function createOrder(employer: SessionUser, input: CreateOrderInput) {
  const [found] = await db
    .select({ id: matches.id })
    .from(matches)
    .innerJoin(jobRequests, eq(matches.requestId, jobRequests.id))
    .where(and(eq(matches.requestId, input.requestId), eq(matches.workerId, input.workerId), eq(jobRequests.employerId, employer.id)))
    .limit(1);
  if (!found) throw notFound('Proposal');

  const row = await loadMatch(found.id);
  if (row.match.status !== 'PROPOSED') throw conflict('NOT_PROPOSED', 'This worker is no longer available');
  const live = await db.select({ id: matches.id }).from(matches).where(and(eq(matches.requestId, input.requestId), inArray(matches.status, [...LIVE])));
  if (live.length) throw conflict('ALREADY_SENT', 'An order is already with a worker');

  const price = previewPrice(row.worker, row.request);
  const updated = await changeStatus(row, 'SENT', {
    paymentMode: input.paymentMode,
    priceModel: price.priceModel,
    quotedAmount: price.quotedAmount ?? null,
    visitCharge: price.visitCharge ?? null,
  });

  await notify(row.worker.userId, {
    type: 'NEW_ORDER',
    title: 'New work for you',
    body: `${row.request.skill} job, ${row.match.distanceKm} km away`,
    data: {
      matchId: row.match.id,
      requestId: row.request.id,
      skill: row.request.skill,
      jobType: row.request.jobType,
      addressNote: row.request.addressNote,
      description: row.request.description,
      whenText: row.request.whenText,
      distanceKm: row.match.distanceKm,
      visitCharge: updated.visitCharge,
      quotedAmount: updated.quotedAmount,
      paymentMode: input.paymentMode,
    },
  });
  return { match: updated, replyKey: 'orderAccepted' as const }; // AI: "order confirmed, worker is coming"
}

// Employer taps Reject. Other proposed workers stay visible; if none are left, the next 3 are fetched.
export async function rejectProposal(employer: SessionUser, matchId: string) {
  const row = await loadMatch(matchId);
  assertEmployer(row, employer);
  await changeStatus(row, 'EMPLOYER_REJECTED');
  return { replyKey: await afterWorkerDropped(row) };
}

// Shared by "employer rejected" and "worker said no / did not answer": show remaining or find more.
async function afterWorkerDropped(row: Loaded): Promise<'nextWorkers' | 'noWorkerNow'> {
  const left = await db
    .select({ id: matches.id })
    .from(matches)
    .where(and(eq(matches.requestId, row.request.id), eq(matches.status, 'PROPOSED')));
  if (left.length > 0) return 'nextWorkers';
  const more = await proposeWorkers(row.request, 3);
  if (more.length > 0) return 'nextWorkers';
  await handleNoMatch(row.request);
  return 'noWorkerNow';
}

/* ---------------- worker: accept / skip ---------------- */
export async function workerRespond(worker: SessionUser, matchId: string, accept: boolean) {
  const row = await loadMatch(matchId);
  assertWorker(row, worker);

  if (!accept) {
    await changeStatus(row, 'REJECTED');
    await notify(row.request.employerId, {
      type: 'ORDER_REJECTED',
      title: 'Worker is busy',
      body: 'This worker cannot come. Please choose another worker.',
      data: { requestId: row.request.id, replyKey: 'nextWorkers' },
    });
    await afterWorkerDropped(row);
    return { status: 'REJECTED' as const };
  }

  let match = await changeStatus(row, 'ACCEPTED', { acceptedAt: new Date() });
  await db.update(jobRequests).set({ status: 'ASSIGNED' }).where(eq(jobRequests.id, row.request.id));
  await db.update(matches).set({ status: 'CANCELLED' }).where(and(eq(matches.requestId, row.request.id), eq(matches.status, 'PROPOSED')));

  if (row.request.jobType === 'LONG_TERM') {
    match = await changeStatus({ ...row, match }, 'ACTIVE'); // hired
    if (match.quotedAmount) await ensurePayment(match.id, match.quotedAmount, monthKeyIST()); // first month salary
  } else if (row.request.pricingType === 'FIXED' && match.quotedAmount != null) {
    await ensurePayment(match.id, match.quotedAmount); // price is final already
  } // inspection jobs: payment is created when the quote is approved

  await notify(row.request.employerId, {
    type: 'ORDER_ACCEPTED',
    title: 'Worker is coming',
    body: 'Your worker accepted the order and is on the way. You can watch on the map.',
    data: { matchId: match.id, requestId: row.request.id },
  });
  return { status: match.status };
}

// Offers nobody answered in time are skipped (called every minute from jobs.ts). Sent-time = the NEW_ORDER notification time.
export async function expireStaleOffers(): Promise<number> {
  const cutoff = new Date(Date.now() - env.OFFER_TIMEOUT_MINUTES * 60 * 1000);
  const stale = await db
    .select({ id: matches.id })
    .from(matches)
    .where(
      and(
        eq(matches.status, 'SENT'),
        sql`not exists (select 1 from notifications n where n.type = 'NEW_ORDER' and n.data->>'matchId' = ${matches.id} and n.created_at > ${cutoff.toISOString()})`,
      ),
    );
  for (const s of stale) {
    const row = await loadMatch(s.id);
    await changeStatus(row, 'EXPIRED');
    await notify(row.request.employerId, {
      type: 'ORDER_EXPIRED',
      title: 'No reply from worker',
      body: 'This worker did not reply. Please choose another worker.',
      data: { requestId: row.request.id, replyKey: 'nextWorkers' },
    });
    await afterWorkerDropped(row);
  }
  return stale.length;
}

/* ---------------- worker: progress ---------------- */
export async function updateStatus(worker: SessionUser, matchId: string, to: 'ON_THE_WAY' | 'ARRIVED' | 'COMPLETED') {
  const row = await loadMatch(matchId);
  assertWorker(row, worker);
  if (to === 'COMPLETED' && row.request.pricingType === 'INSPECTION_NEEDED' && row.match.quoteStatus !== 'APPROVED') {
    throw conflict('QUOTE_REQUIRED', 'Send the quote and get it approved before finishing');
  }
  const match = await changeStatus(row, to, to === 'COMPLETED' ? { completedAt: new Date() } : {});

  if (to === 'COMPLETED') {
    const amount = match.quotedAmount ?? match.visitCharge ?? 0;
    if (row.request.jobType !== 'LONG_TERM') await ensurePayment(match.id, amount);
  }
  const text = { ON_THE_WAY: 'Your worker has left and is coming', ARRIVED: 'Your worker has arrived', COMPLETED: 'The work is finished. Please pay and rate.' }[to];
  await notify(row.request.employerId, { type: to === 'COMPLETED' ? 'ORDER_COMPLETED' : to, title: text, body: text, data: { matchId, requestId: row.request.id } });
  return match;
}

/* ---------------- inspection jobs: quote ---------------- */
// Worker looked at the problem and says what it will cost (labour + material).
export async function sendQuote(worker: SessionUser, matchId: string, input: QuoteInput) {
  const row = await loadMatch(matchId);
  assertWorker(row, worker);
  if (row.request.pricingType !== 'INSPECTION_NEEDED') throw badRequest('NO_QUOTE_NEEDED', 'This job has a fixed price');
  if (row.match.status !== 'ARRIVED') throw conflict('NOT_ARRIVED', 'Send the quote after you reach the place');
  if (row.match.quoteStatus === 'APPROVED') throw conflict('QUOTE_ALREADY_APPROVED');

  const q = validateQuote(row.worker, input.labourAmount, input.materialAmount, row.match.visitCharge ?? 0);
  const [match] = await db
    .update(matches)
    .set({ labourAmount: q.labourAmount, materialAmount: q.materialAmount, quoteNote: input.note ?? null, quoteStatus: 'SENT', quotedAmount: q.finalAmount })
    .where(eq(matches.id, matchId))
    .returning();
  await notify(row.request.employerId, {
    type: 'QUOTE_SENT',
    title: 'Quote received',
    body: `Total Rs ${q.finalAmount} (labour Rs ${q.labourAmount}, material Rs ${q.materialAmount})`,
    data: { matchId, requestId: row.request.id, ...q },
  });
  return match!;
}

// Employer approves (amount locked) or rejects (pays only the visit charge, job ends).
export async function respondQuote(employer: SessionUser, matchId: string, approve: boolean) {
  const row = await loadMatch(matchId);
  assertEmployer(row, employer);
  if (row.match.quoteStatus !== 'SENT') throw conflict('NO_QUOTE', 'There is no quote to answer');

  if (approve) {
    await db.update(matches).set({ quoteStatus: 'APPROVED' }).where(eq(matches.id, matchId));
    await ensurePayment(matchId, row.match.quotedAmount ?? 0);
  } else {
    await db.update(matches).set({ quoteStatus: 'REJECTED' }).where(eq(matches.id, matchId));
    await ensurePayment(matchId, row.match.visitCharge ?? 0);
    await changeStatus(row, 'COMPLETED', { completedAt: new Date() });
  }
  await notify(row.worker.userId, {
    type: approve ? 'QUOTE_APPROVED' : 'QUOTE_REJECTED',
    title: approve ? 'Quote approved' : 'Quote rejected',
    body: approve ? 'Go ahead with the work.' : 'The employer did not accept the quote. You get the visit charge.',
    data: { matchId },
  });
  return { approved: approve };
}

/* ---------------- cancel / rate ---------------- */
export async function cancelOrder(user: SessionUser, matchId: string) {
  const row = await loadMatch(matchId);
  if (row.request.employerId !== user.id && row.worker.userId !== user.id) throw forbidden();
  const match = await changeStatus(row, 'CANCELLED');
  const otherId = user.id === row.request.employerId ? row.worker.userId : row.request.employerId;
  await notify(otherId, { type: 'ORDER_CANCELLED', title: 'Order cancelled', body: 'The order was cancelled.', data: { matchId } });
  return match;
}

export async function rateOrder(employer: SessionUser, matchId: string, rating: number) {
  const row = await loadMatch(matchId);
  assertEmployer(row, employer);
  if (row.match.status !== 'COMPLETED') throw conflict('NOT_COMPLETED', 'You can rate after the work is done');
  if (row.match.rating != null) throw conflict('ALREADY_RATED');
  const w = row.worker;
  const newCount = w.ratingCount + 1;
  await db.update(matches).set({ rating }).where(eq(matches.id, matchId));
  await db.update(workerProfiles).set({ ratingCount: newCount, ratingAvg: round1((w.ratingAvg * w.ratingCount + rating) / newCount) }).where(eq(workerProfiles.id, w.id));
}

/* ---------------- reading ---------------- */
async function buildView(row: Loaded) {
  const [[workerUser], [employerUser], pays] = await Promise.all([
    db.select({ name: users.name, phone: users.phoneNumber }).from(users).where(eq(users.id, row.worker.userId)).limit(1),
    db.select({ name: users.name, phone: users.phoneNumber }).from(users).where(eq(users.id, row.request.employerId)).limit(1),
    db.select().from(payments).where(eq(payments.matchId, row.match.id)).orderBy(desc(payments.createdAt)),
  ]);
  const reveal = REVEAL.includes(row.match.status as OrderStatus);
  const { match, request, worker } = row;
  return {
    id: match.id,
    status: match.status,
    request: {
      id: request.id, skill: request.skill, jobType: request.jobType, addressNote: request.addressNote, description: request.description,
      whenText: request.whenText, windowStart: request.windowStart, windowEnd: request.windowEnd, lat: request.lat, lng: request.lng,
      durationMonths: request.durationMonths, offeredSalary: request.offeredSalary, pricingType: request.pricingType,
    },
    worker: { id: worker.id, name: workerUser?.name ?? '', skills: worker.skills, ratingAvg: worker.ratingAvg, ratingCount: worker.ratingCount, phone: reveal ? workerUser?.phone ?? null : null },
    employer: { name: employerUser?.name ?? '', phone: reveal ? employerUser?.phone ?? null : null },
    distanceKm: match.distanceKm,
    pricing: {
      paymentMode: match.paymentMode, priceModel: match.priceModel, quotedAmount: match.quotedAmount, visitCharge: match.visitCharge,
      labourAmount: match.labourAmount, materialAmount: match.materialAmount, quoteStatus: match.quoteStatus, quoteNote: match.quoteNote,
    },
    payment: pays[0] ?? null,
    rating: match.rating,
    createdAt: match.createdAt,
  };
}

export async function getOrderView(user: SessionUser, matchId: string) {
  const row = await loadMatch(matchId);
  if (row.request.employerId !== user.id && row.worker.userId !== user.id) throw forbidden();
  return buildView(row);
}

// Worker: offers waiting for Accept / Skip
export async function listOffers(worker: SessionUser) {
  const rows = await db
    .select({ id: matches.id })
    .from(matches)
    .innerJoin(workerProfiles, eq(matches.workerId, workerProfiles.id))
    .where(and(eq(workerProfiles.userId, worker.id), eq(matches.status, 'SENT')))
    .orderBy(desc(matches.createdAt));
  return Promise.all(rows.map(async (r) => buildView(await loadMatch(r.id))));
}

// Orders for the logged-in user (offers and unanswered proposals are shown elsewhere)
export async function listOrders(user: SessionUser) {
  const statuses: OrderStatus[] = user.role === 'WORKER'
    ? ['ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'ACTIVE', 'COMPLETED', 'CANCELLED']
    : ['SENT', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'ACTIVE', 'COMPLETED', 'CANCELLED'];
  const who = user.role === 'WORKER' ? eq(workerProfiles.userId, user.id) : eq(jobRequests.employerId, user.id);
  const rows = await db
    .select({ id: matches.id })
    .from(matches)
    .innerJoin(jobRequests, eq(matches.requestId, jobRequests.id))
    .innerJoin(workerProfiles, eq(matches.workerId, workerProfiles.id))
    .where(and(who, inArray(matches.status, statuses)))
    .orderBy(desc(matches.createdAt))
    .limit(50);
  return Promise.all(rows.map(async (r) => buildView(await loadMatch(r.id))));
}

// Live map: where is the worker now, how far from the home, rough arrival time
export async function getTracking(user: SessionUser, matchId: string) {
  const row = await loadMatch(matchId);
  if (row.request.employerId !== user.id && row.worker.userId !== user.id) throw forbidden();
  const { worker, request, match } = row;
  const hasPos = worker.lastLat != null && worker.lastLng != null;
  const remainingKm = hasPos ? round1(haversineKm(worker.lastLat!, worker.lastLng!, request.lat, request.lng)) : null;
  return {
    status: match.status,
    worker: { lat: worker.lastLat, lng: worker.lastLng, updatedAt: worker.lastLocationAt },
    destination: { lat: request.lat, lng: request.lng },
    remainingKm,
    etaMinutes: remainingKm != null ? Math.max(1, Math.ceil((remainingKm / 20) * 60)) : null, // assumes about 20 km/h
  };
}
