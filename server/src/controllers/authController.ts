import type { Response } from 'express';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { createUser, serializeUser } from '../services/authService.js';
import type { AuthRequest } from '../types/auth.types.js';
import { COOKIE_NAME, ONE_DAY_MS } from '../utils/constants.js';
import { generateToken } from '../utils/generateToken.js';

const setTokenCookie = (res: Response, id: string) => {
  res.cookie(COOKIE_NAME, generateToken(id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: ONE_DAY_MS,
  });
};

export const signup = asyncHandler(async (req, res) => {
  const exists = await User.findOne({ email: req.body.email });
  if (exists) { res.status(409); throw new Error('Email already registered'); }
  const user = await createUser(req.body);
  setTokenCookie(res, user.id);
  res.status(201).json({ user: serializeUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const user: any = await User.findOne({ email: req.body.email });
  if (!user || !(await user.matchPassword(req.body.password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  setTokenCookie(res, user.id);
  res.json({ user: serializeUser(user) });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ message: 'Logged out' });
});

export const me = asyncHandler(async (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res) => {
  const user = await User.findByIdAndUpdate(req.user?.id, req.body, { new: true }).select('-password');
  res.json({ user: serializeUser(user) });
});
