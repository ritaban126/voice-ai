// PURPOSE: connects Better Auth (defined in packages/auth) to Express. Handles /api/auth/* (send OTP, verify OTP, session).
import { toNodeHandler } from 'better-auth/node';
import { auth } from '@repo/auth/server';

export { auth };
export const authHandler = toNodeHandler(auth);
