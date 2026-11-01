// PURPOSE: small background timers. (1) skip workers who did not answer an order in time, (2) create monthly salary rows for maid / nurse.
import { expireStaleOffers } from './services/order.service';
import { createMonthlyPayments } from './services/payment.service';

async function safe(name: string, fn: () => Promise<unknown>) {
  try { await fn(); } catch (err) { console.error(`[job:${name}]`, err); }
}

export function startJobs(): void {
  setInterval(() => void safe('expire-offers', expireStaleOffers), 60 * 1000); // every minute
  setInterval(() => void safe('monthly-payments', createMonthlyPayments), 60 * 60 * 1000); // every hour
  void safe('monthly-payments', createMonthlyPayments);
}
