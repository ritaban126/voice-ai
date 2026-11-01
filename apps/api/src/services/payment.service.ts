// PURPOSE: payment records (no real money moves in the app). Employer says "Paisa diya", worker says "Paisa mila" or raises a dispute.
// Also builds the UPI payment link (for the QR) and creates the monthly salary rows for maid / nurse.
import { db, payments, matches, jobRequests, workerProfiles, user as users, and, desc, eq } from '@repo/db';
import { PAYMENT_MODES } from '@repo/shared';
import { AppError, conflict, forbidden, notFound } from '../lib/errors';
import { monthKeyIST } from '../lib/time';
import type { Payment, SessionUser } from '../types';
import { notify } from './notify.service';

type PaymentMode = (typeof PAYMENT_MODES)[number];

async function loadPayment(paymentId: string) {
  const [row] = await db
    .select({ payment: payments, match: matches, request: jobRequests, worker: workerProfiles })
    .from(payments)
    .innerJoin(matches, eq(payments.matchId, matches.id))
    .innerJoin(jobRequests, eq(matches.requestId, jobRequests.id))
    .innerJoin(workerProfiles, eq(matches.workerId, workerProfiles.id))
    .where(eq(payments.id, paymentId))
    .limit(1);
  if (!row) throw notFound('Payment');
  return row;
}

// Creates the payment once the amount is locked. Same order + same period = same row (no duplicates).
export async function ensurePayment(matchId: string, amount: number, period: string | null = null): Promise<Payment> {
  const rows = await db.select().from(payments).where(eq(payments.matchId, matchId));
  const found = rows.find((p) => (p.period ?? null) === period);
  if (found) return found;
  const [row] = await db.insert(payments).values({ matchId, agreedAmount: amount, period }).returning();
  return row!;
}

// Employer: "Paisa diya" (cash or UPI)
export async function markPaid(employer: SessionUser, paymentId: string, mode: PaymentMode) {
  const { payment, request, worker } = await loadPayment(paymentId);
  if (request.employerId !== employer.id) throw forbidden();
  if (payment.status !== 'PENDING') throw conflict('BAD_PAYMENT_STATE', `Payment is already ${payment.status}`);
  const [row] = await db
    .update(payments)
    .set({ status: 'EMPLOYER_MARKED_PAID', mode, employerMarkedAt: new Date() })
    .where(eq(payments.id, paymentId))
    .returning();
  await notify(worker.userId, {
    type: 'PAYMENT_MARKED',
    title: 'Payment sent',
    body: `The employer says Rs ${payment.agreedAmount} is paid. Please confirm.`,
    data: { paymentId, matchId: payment.matchId },
  });
  return row!;
}

// Worker: "Paisa mila". Works even if the employer did not tap first (cash given on the spot).
export async function confirmPaid(worker: SessionUser, paymentId: string) {
  const { payment, request, worker: wp } = await loadPayment(paymentId);
  if (wp.userId !== worker.id) throw forbidden();
  if (!['PENDING', 'EMPLOYER_MARKED_PAID', 'DISPUTED'].includes(payment.status)) throw conflict('BAD_PAYMENT_STATE');
  const [row] = await db.update(payments).set({ status: 'PAID', workerConfirmedAt: new Date() }).where(eq(payments.id, paymentId)).returning();
  await notify(request.employerId, {
    type: 'PAYMENT_CONFIRMED',
    title: 'Payment confirmed',
    body: 'The worker confirmed the payment. Thank you!',
    data: { paymentId, matchId: payment.matchId },
  });
  return row!;
}

// Worker: "Paisa nahi mila"
export async function dispute(worker: SessionUser, paymentId: string, note?: string) {
  const { payment, request, worker: wp } = await loadPayment(paymentId);
  if (wp.userId !== worker.id) throw forbidden();
  if (payment.status === 'PAID') throw conflict('ALREADY_PAID');
  const [row] = await db.update(payments).set({ status: 'DISPUTED', disputeNote: note ?? null }).where(eq(payments.id, paymentId)).returning();
  await notify(request.employerId, {
    type: 'PAYMENT_DISPUTED',
    title: 'Payment not received',
    body: 'The worker says the payment was not received.',
    data: { paymentId, matchId: payment.matchId },
  });
  return row!;
}

// UPI link for the QR. Amount is the locked payment amount, money goes to the worker's own UPI ID.
export async function buildUpiLink(user: SessionUser, matchId: string) {
  const [row] = await db
    .select({ match: matches, request: jobRequests, worker: workerProfiles, workerName: users.name })
    .from(matches)
    .innerJoin(jobRequests, eq(matches.requestId, jobRequests.id))
    .innerJoin(workerProfiles, eq(matches.workerId, workerProfiles.id))
    .innerJoin(users, eq(workerProfiles.userId, users.id))
    .where(eq(matches.id, matchId))
    .limit(1);
  if (!row) throw notFound('Order');
  if (row.request.employerId !== user.id && row.worker.userId !== user.id) throw forbidden();

  const [pay] = await db.select().from(payments).where(eq(payments.matchId, matchId)).orderBy(desc(payments.createdAt)).limit(1);
  if (!pay) throw new AppError(409, 'AMOUNT_NOT_LOCKED', 'The amount is not final yet');
  if (!row.worker.upiId) throw new AppError(409, 'WORKER_UPI_MISSING', 'The worker has not added a UPI ID. Pay by cash.');

  const params = new URLSearchParams({ pa: row.worker.upiId, pn: row.workerName, am: pay.agreedAmount.toFixed(2), cu: 'INR', tn: 'KaamBol order' });
  return { paymentId: pay.id, amount: pay.agreedAmount, upiId: row.worker.upiId, upiLink: `upi://pay?${params.toString()}` };
}

// My payments (worker: money I should get, employer: money I should pay)
export async function listPayments(user: SessionUser) {
  const who = user.role === 'WORKER' ? eq(workerProfiles.userId, user.id) : eq(jobRequests.employerId, user.id);
  return db
    .select({ payment: payments, skill: jobRequests.skill, matchId: matches.id })
    .from(payments)
    .innerJoin(matches, eq(payments.matchId, matches.id))
    .innerJoin(jobRequests, eq(matches.requestId, jobRequests.id))
    .innerJoin(workerProfiles, eq(matches.workerId, workerProfiles.id))
    .where(who)
    .orderBy(desc(payments.createdAt))
    .limit(100);
}

// Runs from jobs.ts: every running maid / nurse hire gets a salary row for the current month.
export async function createMonthlyPayments(): Promise<number> {
  const period = monthKeyIST();
  const active = await db.select().from(matches).where(eq(matches.status, 'ACTIVE'));
  let created = 0;
  for (const m of active) {
    const rows = await db.select({ id: payments.id }).from(payments).where(and(eq(payments.matchId, m.id), eq(payments.period, period)));
    if (rows.length === 0 && m.quotedAmount) {
      await ensurePayment(m.id, m.quotedAmount, period);
      created += 1;
    }
  }
  return created;
}
