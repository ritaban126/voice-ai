// PURPOSE: last stop for errors. Turns AppError / unknown errors into a clean JSON reply { error: { code, message } }.
import type { ErrorRequestHandler, RequestHandler } from 'express';
import { AppError } from '../lib/errors';

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: { code: err.code, message: err.message } });
    return;
  }
  console.error('[error]', err);
  res.status(500).json({ error: { code: 'INTERNAL', message: 'Something went wrong' } });
};
