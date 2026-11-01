import type { SkillId } from './skills';

// Normal price range per skill, in rupees. STARTING VALUES: tune them for your city.
// Used to (1) suggest a service charge at signup and (2) block unfair rates in settings.
export interface Band { min: number; max: number }
export interface PriceBand {
  serviceCharge?: Band; // visit / minimum charge (on-demand skills)
  dailyRate?: Band;
  monthlySalary?: Band; // long-term skills (maid, nurse)
}
export type PriceField = keyof PriceBand;

export const PRICE_BANDS: Record<SkillId, PriceBand> = {
  plumber: { serviceCharge: { min: 100, max: 300 }, dailyRate: { min: 500, max: 1000 } },
  electrician: { serviceCharge: { min: 100, max: 300 }, dailyRate: { min: 500, max: 1000 } },
  carpenter: { serviceCharge: { min: 150, max: 350 }, dailyRate: { min: 600, max: 1100 } },
  painter: { serviceCharge: { min: 150, max: 350 }, dailyRate: { min: 600, max: 1000 } },
  cleaning: { serviceCharge: { min: 200, max: 800 }, dailyRate: { min: 500, max: 1200 } },
  salon: { serviceCharge: { min: 300, max: 2000 } },
  maid: { monthlySalary: { min: 3000, max: 12000 } },
  nurse: { monthlySalary: { min: 10000, max: 35000 } },
};

const round10 = (n: number) => Math.round(n / 10) * 10;

// Suggested default: a little above the minimum, so new workers stay competitive.
export function suggestValue(skill: SkillId, field: PriceField): number | null {
  const band = PRICE_BANDS[skill][field];
  if (!band) return null;
  return round10(band.min + (band.max - band.min) * 0.3);
}

export function isWithinBand(skill: SkillId, field: PriceField, value: number): boolean {
  const band = PRICE_BANDS[skill][field];
  return !!band && value >= band.min && value <= band.max;
}

export function clampToBand(skill: SkillId, field: PriceField, value: number): number {
  const band = PRICE_BANDS[skill][field];
  if (!band) return value;
  return Math.min(band.max, Math.max(band.min, value));
}