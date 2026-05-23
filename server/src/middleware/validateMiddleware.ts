import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400);
    throw new Error(parsed.error.issues[0]?.message || 'Validation failed');
  }
  req.body = parsed.data;
  next();
};
