// PURPOSE: checks the request body with a Zod schema (from packages/shared) and replaces it with the cleaned data.
import type { RequestHandler } from 'express';
import { AppError } from '../lib/errors';

interface Parseable {
  safeParse(data: unknown): { success: true; data: unknown } | { success: false; error: { issues: { path: PropertyKey[]; message: string }[] } };
}

export const validateBody = (schema: Parseable): RequestHandler => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const msg = result.error.issues.map((i) => `${i.path.map(String).join('.')}: ${i.message}`).join('; ');
    throw new AppError(400, 'VALIDATION_ERROR', msg);
  }
  req.body = result.data;
  next();
};
