// PURPOSE: blocks anonymous calls. Reads the Better Auth session cookie and puts the user on req.user.
import type { Request, RequestHandler } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { isLang, ROLES, type Role } from '@repo/shared';
import { auth } from '../lib/auth';
import { AppError } from '../lib/errors';
import type { SessionUser } from '../types';

export const requireAuth: RequestHandler = async (req, _res, next) => {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  if (!session) throw new AppError(401, 'UNAUTHENTICATED', 'Please login');

  const u = session.user as unknown as Record<string, unknown>;
  const role = typeof u.role === 'string' && (ROLES as readonly string[]).includes(u.role) ? (u.role as Role) : null;
  req.user = {
    id: String(u.id),
    name: String(u.name ?? ''),
    phoneNumber: typeof u.phoneNumber === 'string' ? u.phoneNumber : null,
    role,
    lang: isLang(u.lang) ? u.lang : 'hi',
    voiceReplies: u.voiceReplies !== false,
  };
  next();
};

// Use inside routes after requireAuth
export function currentUser(req: Request): SessionUser {
  if (!req.user) throw new AppError(401, 'UNAUTHENTICATED', 'Please login');
  return req.user;
}
