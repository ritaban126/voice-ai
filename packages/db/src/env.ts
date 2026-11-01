// Import this FIRST in scripts (seed) so DATABASE_URL is loaded before client.ts runs.
import { config } from 'dotenv';
config({ path: '../../.env' });