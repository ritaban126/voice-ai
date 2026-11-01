// PURPOSE: loads the root .env file and checks every setting once, so a missing key fails at startup (not later).
// Must be the FIRST import in index.ts, because @repo/db and @repo/auth read process.env when they load.
import { config } from 'dotenv';
import { z } from 'zod';

config({ path: '../../.env' }); // the API is started from apps/api

const schema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  WEB_URL: z.string().default('http://localhost:3000'),
  BETTER_AUTH_SECRET: z.string().min(16),
  BETTER_AUTH_URL: z.string().default('http://localhost:3000'),
  // LLM that turns speech text into structured data. Without a key the simple rule-based fallback is used.
  ANTHROPIC_API_KEY: z.string().optional(),
  LLM_MODEL: z.string().default('claude-haiku-5-5'),
  // Set true if Gnani needs wav audio (needs the ffmpeg program installed on the server)
  CONVERT_TO_WAV: z.enum(['true', 'false']).default('false'),
  // A worker who does not answer an order within this time is skipped
  OFFER_TIMEOUT_MINUTES: z.coerce.number().default(5),
  // Web Push (phone notifications when the app is closed). Optional.
  VAPID_PUBLIC_KEY: z.string().optional(),
  VAPID_PRIVATE_KEY: z.string().optional(),
  VAPID_SUBJECT: z.string().default('mailto:admin@example.com'),
});

export const env = schema.parse(process.env);
