import type { Request } from 'express';

export type JwtPayload = { id: string };

export type AuthRequest = Request & {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    githubUsername?: string;
  };
};
