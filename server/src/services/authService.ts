import User from '../models/User.js';

export const serializeUser = (user: any) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  githubUsername: user.githubUsername,
});

export const createUser = (payload: { name: string; email: string; password: string }) => User.create(payload);
