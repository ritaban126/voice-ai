import { z } from 'zod';
import { LANG_CODES } from './languages';
import { SKILL_IDS } from './skills';
import { JOB_TYPES, PAYMENT_MODES, ROLES } from './orderStatus';

/* ---------- basics ---------- */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, '');
  if (/^\+91\d{10}$/.test(digits)) return digits;
  if (/^91\d{10}$/.test(digits)) return `+${digits}`;
  if (/^0\d{10}$/.test(digits)) return `+91${digits.slice(1)}`;
  if (/^\d{10}$/.test(digits)) return `+91${digits}`;
  return digits;
}

// Indian mobile numbers only for now. Output is always +91XXXXXXXXXX.
export const phoneSchema = z
  .string()
  .transform(normalizePhone)
  .refine((p) => /^\+91[6-9]\d{9}$/.test(p), 'Enter a valid 10-digit mobile number');
export const otpSchema = z.string().regex(/^\d{6}$/, 'Enter the 6-digit OTP');
export const langSchema = z.enum(LANG_CODES);
export const roleSchema = z.enum(ROLES);
export const skillSchema = z.enum(SKILL_IDS);
export const latLngSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});
const rupees = z.coerce.number().int().positive();

/* ---------- auth / onboarding ---------- */
export const sendOtpInput = z.object({ phone: phoneSchema });
export const verifyOtpInput = z.object({ phone: phoneSchema, code: otpSchema });
export const onboardInput = z.object({ lang: langSchema, role: roleSchema });

/* ---------- what the LLM extracts from speech ---------- */
export const workerProfileDraft = z.object({
  skills: z.array(skillSchema).min(1),
  areaText: z.string().min(1), // "Durgachowk"
  landmark: z.string().optional(),
  serviceCharge: rupees.optional(), // if missing, the app suggests one from priceBands
  dailyRate: rupees.optional(),
  expectedSalary: rupees.optional(), // monthly, maid / nurse
});

export const employerRequestDraft = z.object({
  skill: skillSchema,
  addressNote: z.string().optional(), // "Durgachowk mor ke samne safed ghar"
  jobType: z.enum(JOB_TYPES).default('ON_DEMAND'),
  whenText: z.string().optional(), // "abhi", "kal subah"
  description: z.string().optional(),
  estimatedHours: z.coerce.number().positive().optional(),
  durationMonths: z.coerce.number().int().positive().optional(), // long-term
  offeredSalary: rupees.optional(), // long-term, monthly
});

export const changeRateDraft = z.object({
  serviceCharge: rupees.optional(),
  dailyRate: rupees.optional(),
  expectedSalary: rupees.optional(),
});

export const voiceIntentSchema = z.discriminatedUnion('intent', [
  z.object({ intent: z.literal('SET_PROFILE'), data: workerProfileDraft }),
  z.object({ intent: z.literal('CHANGE_RATE'), data: changeRateDraft }),
  z.object({ intent: z.literal('SET_AVAILABLE'), data: z.object({ available: z.boolean() }) }),
  z.object({ intent: z.literal('REQUEST_WORKER'), data: employerRequestDraft }),
  z.object({ intent: z.literal('UNKNOWN') }),
]);

/* ---------- API inputs ---------- */
export const searchWorkersInput = employerRequestDraft.extend({
  lat: latLngSchema.shape.lat,
  lng: latLngSchema.shape.lng,
  rawTranscript: z.string().optional(),
});
export const createOrderInput = z.object({
  requestId: z.string().min(1),
  workerId: z.string().min(1),
  paymentMode: z.enum(PAYMENT_MODES),
});
export const quoteInput = z.object({
  labourAmount: z.coerce.number().int().min(0),
  materialAmount: z.coerce.number().int().min(0).default(0),
  note: z.string().optional(),
});
export const changePricingInput = changeRateDraft.refine(
  (v) => Object.values(v).some((x) => x !== undefined),
  'Nothing to change',
);
export const markPaidInput = z.object({ mode: z.enum(PAYMENT_MODES) });
export const ratingInput = z.object({ rating: z.number().int().min(1).max(5) });

/* ---------- types ---------- */
export type WorkerProfileDraft = z.infer<typeof workerProfileDraft>;
export type EmployerRequestDraft = z.infer<typeof employerRequestDraft>;
export type VoiceIntent = z.infer<typeof voiceIntentSchema>;
export type SearchWorkersInput = z.infer<typeof searchWorkersInput>;
export type CreateOrderInput = z.infer<typeof createOrderInput>;
export type QuoteInput = z.infer<typeof quoteInput>;