import type { ErrorRequestHandler } from 'express';

export const notFound = (_req: unknown, _res: unknown, next: (error: Error) => void) => {
  next(new Error('Route not found'));
};

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  const status = res.statusCode >= 400 ? res.statusCode : 500;
  res.status(status).json({
    message: error.message || 'Server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
  });
};
