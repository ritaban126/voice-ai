// PURPOSE: all price rules in one file. Small jobs cost less than a full day, inspection jobs (electrician, plumber...)
// start with a visit charge and then a quote. AI never decides money, only this code does.
import type { JOB_SIZES } from '@repo/shared';
import { needsInspection, type SkillId } from '@repo/shared';
import { AppError } from '../lib/errors';
import type { JobRequest, WorkerProfile } from '../types';

type JobSize = (typeof JOB_SIZES)[number];
const round10 = (n: number) => Math.round(n / 10) * 10;

export interface PricePreview {
  priceModel: 'MIN_VISIT' | 'HALF_DAY' | 'FULL_DAY' | 'MONTHLY';
  quotedAmount?: number; // fixed price for the job
  visitCharge?: number; // inspection jobs: pay this first, quote comes later
}

// Hours -> size. Unknown hours are treated as a half day (the fair middle).
export function jobSizeFromHours(hours?: number | null): JobSize {
  if (hours == null) return 'HALF_DAY';
  if (hours <= 2) return 'SMALL';
  if (hours <= 4) return 'HALF_DAY';
  return 'FULL_DAY';
}

// Fixed-price jobs (cleaning, salon...). Never more than the worker's daily rate for jobs up to a day.
export function calcFixedPrice(worker: Pick<WorkerProfile, 'dailyRate' | 'serviceCharge'>, hours?: number | null): PricePreview {
  const daily = worker.dailyRate;
  const minCharge = worker.serviceCharge;
  if (!daily) return { priceModel: 'MIN_VISIT', quotedAmount: minCharge }; // no daily rate (salon): the service charge is the price

  const h = hours ?? 3;
  const hourly = (daily / 8) * 1.25; // overtime-style hourly rate
  if (h <= 2) return { priceModel: 'MIN_VISIT', quotedAmount: Math.min(daily, round10(Math.max(minCharge, hourly * h))) };
  if (h <= 4) return { priceModel: 'HALF_DAY', quotedAmount: Math.min(daily, round10(daily * 0.6)) };
  if (h <= 8) return { priceModel: 'FULL_DAY', quotedAmount: daily };
  return { priceModel: 'FULL_DAY', quotedAmount: round10(daily + (h - 8) * hourly) };
}

// What to show on the worker card and what gets locked when the employer confirms.
export function previewPrice(
  worker: WorkerProfile,
  request: Pick<JobRequest, 'skill' | 'jobType' | 'estimatedHours' | 'offeredSalary'>,
): PricePreview {
  if (request.jobType === 'LONG_TERM') {
    return { priceModel: 'MONTHLY', quotedAmount: request.offeredSalary ?? worker.expectedSalary ?? 0 };
  }
  if (needsInspection(request.skill as SkillId)) {
    return { priceModel: 'MIN_VISIT', visitCharge: worker.serviceCharge };
  }
  return calcFixedPrice(worker, request.estimatedHours);
}

// Worker's quote after seeing the problem. Labour cannot be more than a day's rate. Visit charge is included in the final amount.
export function validateQuote(worker: Pick<WorkerProfile, 'dailyRate'>, labour: number, material: number, visitCharge: number) {
  if (worker.dailyRate && labour > worker.dailyRate) {
    throw new AppError(422, 'QUOTE_TOO_HIGH', `Labour cannot be more than Rs ${worker.dailyRate} (your daily rate)`);
  }
  return { labourAmount: labour, materialAmount: material, finalAmount: Math.max(labour + material, visitCharge) };
}
