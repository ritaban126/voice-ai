// import 'dotenv/config';
// import {defineConfig} from "drizzle-kit"

// export default defineConfig({
//   out: './drizzle',
//   schema: './src/schema.ts',
//   dialect: 'postgresql',
//   dbCredentials: {
//     url: process.env.DATABASE_URL!,
//   },
// });






import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '../../.env' }); // run from packages/db

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema.ts',
  out: './drizzle',
  dbCredentials: { url: process.env.DATABASE_URL! },
});