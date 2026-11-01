// PURPOSE: shared TypeScript types used across the API (logged-in user, table row types).
import type { LangCode, Role } from '@repo/shared';
import type { workerProfiles, employerProfiles, jobRequests, matches, payments, areas } from '@repo/db';

export interface SessionUser {
  id: string;
  name: string;
  phoneNumber: string | null;
  role: Role | null;
  lang: LangCode;
  voiceReplies: boolean;
}

export type WorkerProfile = typeof workerProfiles.$inferSelect;
export type EmployerProfile = typeof employerProfiles.$inferSelect;
export type JobRequest = typeof jobRequests.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Area = typeof areas.$inferSelect;

// Lets us write req.user in every route
declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}
