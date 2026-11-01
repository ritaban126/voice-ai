import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { phoneNumber } from 'better-auth/plugins';
import { db, schema } from '@repo/db';
import { isLang, ROLES } from '@repo/shared';
import { sendSms } from './sms';

// Server-side Better Auth. Mount in Express BEFORE express.json():
//   app.all('/api/auth/*splat', toNodeHandler(auth))
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL, // the WEB origin, because Next.js proxies /api/* to Express
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.WEB_URL ?? 'http://localhost:3000'],

  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),

  // Extra columns on `user`. The modal sets lang and role with authClient.updateUser().
  user: {
    additionalFields: {
      role: { type: 'string', required: false, input: true },
      lang: { type: 'string', required: false, defaultValue: 'hi', input: true },
      voiceReplies: { type: 'boolean', required: false, defaultValue: true, input: true },
    },
  },

  session: { expiresIn: 60 * 60 * 24 * 30, updateAge: 60 * 60 * 24 }, // stay logged in 30 days

  plugins: [
    phoneNumber({
      otpLength: 6,
      expiresIn: 300, // OTP valid for 5 minutes
      allowedAttempts: 3,
      sendOTP: async ({ phoneNumber: phone, code }) => {
        await sendSms(phone, `${code} is your KaamBol OTP. Do not share it.`);
      },
      // First successful OTP = account created (signup and login are the same step)
      signUpOnVerification: {
        getTempEmail: (phone) => `${phone.replace('+', '')}@phone.kaambol.local`,
        getTempName: (phone) => phone,
      },
    }),
  ],

  // Only allow valid role / lang values, so nobody can set role = "ADMIN" from the browser.
  // (Check the hook signature against your Better Auth version.)
  databaseHooks: {
    user: {
      update: {
        before: async (data: Record<string, unknown>) => {
          if (data.role != null && !(ROLES as readonly string[]).includes(String(data.role))) return false;
          if (data.lang != null && !isLang(data.lang)) return false;
          return { data };
        },
      },
    },
  },
});

export type Auth = typeof auth;