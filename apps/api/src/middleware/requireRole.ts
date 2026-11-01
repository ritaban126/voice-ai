// PURPOSE: only lets the given role(s) (WORKER / EMPLOYER) into a route.
import type { RequestHandler } from 'express';
import type { Role } from '@repo/shared';
import { AppError } from '../lib/errors';

export const requireRole = (...roles: Role[]): RequestHandler => (req, _res, next) => {
  if (!req.user?.role) throw new AppError(409, 'ROLE_NOT_SET', 'Finish signup first (choose worker or employer)');
  if (!roles.includes(req.user.role)) throw new AppError(403, 'WRONG_ROLE', `This is only for ${roles.join(' / ')}`);
  next();
};
