// PURPOSE: stops spam (for example someone hammering the voice route, which costs money). Simple in-memory counter per user/IP.
import type { RequestHandler } from 'express';
import { AppError } from '../lib/errors';

export function rateLimit(opts: { windowMs: number; max: number }): RequestHandler {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return (req, _res, next) => {
    const key = req.user?.id ?? req.ip ?? 'anonymous';
    const now = Date.now();
    const entry = hits.get(key);
    if (!entry || entry.resetAt < now) {
      hits.set(key, { count: 1, resetAt: now + opts.windowMs });
      return next();
    }
    entry.count += 1;
    if (entry.count > opts.max) throw new AppError(429, 'RATE_LIMITED', 'Too many requests, please wait a little');
    next();
  };
}
