import jwt from 'jsonwebtoken';
import type { NextFunction, Response } from 'express';
import User from '../models/User.js';
import { COOKIE_NAME } from '../utils/constants.js';
import type { AuthRequest, JwtPayload } from '../types/auth.types.js';

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    res.status(401);
    throw new Error('Not authorized');
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as JwtPayload;
  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }
  req.user = {
    id: user.id,
    name: user.get('name'),
    email: user.get('email'),
    role: user.get('role'),
    githubUsername: user.get('githubUsername') || undefined,
    currentAddress: user.get('currentAddress') || undefined,
  };
  next();
};
