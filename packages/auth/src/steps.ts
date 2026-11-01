import { micGuideKey, reply, type LangCode, type Role } from '@repo/shared';

// The sign-in modal is a carousel: login first, then language, role, and the first voice input.
export const AUTH_STEPS = ['PHONE', 'OTP', 'LANGUAGE', 'ROLE', 'VOICE'] as const;
export type AuthStep = (typeof AUTH_STEPS)[number];

export const OTP_RESEND_SECONDS = 30;

export function nextStep(step: AuthStep): AuthStep | 'DONE' {
  return AUTH_STEPS[AUTH_STEPS.indexOf(step) + 1] ?? 'DONE';
}
export function prevStep(step: AuthStep): AuthStep {
  return AUTH_STEPS[Math.max(0, AUTH_STEPS.indexOf(step) - 1)]!;
}

// Where to reopen the modal if the user closed it half way.
export function getResumeStep(s: { signedIn: boolean; role?: string | null; hasProfile: boolean }): AuthStep | 'DONE' {
  if (!s.signedIn) return 'PHONE';
  if (!s.role) return 'LANGUAGE'; // language + role are chosen together
  if (!s.hasProfile) return 'VOICE';
  return 'DONE'; // go to the dashboard
}

// The message shown (and spoken) on the voice step: what to say into the mic.
export function voiceGuideFor(role: Role, lang: LangCode): string {
  return reply(micGuideKey(role), lang);
}