'use client';
import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields, phoneNumberClient } from 'better-auth/client/plugins';
import { phoneSchema, otpSchema, type LangCode, type Role } from '@repo/shared';

// Same-origin client: Next.js rewrites /api/* to Express, so no baseURL and no CORS problems.
export const authClient = createAuthClient({
  plugins: [
    phoneNumberClient(),
    inferAdditionalFields({
      user: {
        role: { type: 'string', required: false },
        lang: { type: 'string', required: false },
        voiceReplies: { type: 'boolean', required: false },
      },
    }),
  ],
});

export const { useSession, signOut } = authClient;

/* ---------- helpers the login modal calls, one per step ---------- */

// Step PHONE: validates and normalises the number (+91...), then sends the OTP.
export async function requestOtp(rawPhone: string): Promise<string> {
  const phone = phoneSchema.parse(rawPhone);
  const res = await authClient.phoneNumber.sendOtp({ phoneNumber: phone });
  if (res.error) throw new Error(res.error.message ?? 'Could not send OTP');
  return phone;
}

// Step OTP: verifies the code. A new number creates the account and starts the session.
export async function verifyOtp(rawPhone: string, code: string) {
  const phone = phoneSchema.parse(rawPhone);
  const res = await authClient.phoneNumber.verify({ phoneNumber: phone, code: otpSchema.parse(code) });
  if (res.error) throw new Error(res.error.message ?? 'Wrong OTP');
  return res.data;
}

// Step LANGUAGE
export async function saveLanguage(lang: LangCode) {
  const res = await authClient.updateUser({ lang });
  if (res.error) throw new Error(res.error.message ?? 'Could not save language');
}

// Step ROLE
export async function saveRole(role: Role) {
  const res = await authClient.updateUser({ role });
  if (res.error) throw new Error(res.error.message ?? 'Could not save role');
}