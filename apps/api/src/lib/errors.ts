// PURPOSE: one error type for "expected" problems (wrong input, not allowed...). The error handler turns it into a clean JSON reply.
export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    message?: string,
  ) {
    super(message ?? code);
    this.name = 'AppError';
  }
}

export const badRequest = (code: string, message?: string) => new AppError(400, code, message);
export const forbidden = (message = 'Not allowed') => new AppError(403, 'FORBIDDEN', message);
export const notFound = (what = 'Item') => new AppError(404, 'NOT_FOUND', `${what} not found`);
export const conflict = (code: string, message?: string) => new AppError(409, code, message);
