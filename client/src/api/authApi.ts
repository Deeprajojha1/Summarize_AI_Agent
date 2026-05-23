import api from './axios';
import type { LoginPayload, SignupPayload, User } from '../types/auth.types';

export const authApi = {
  signup: (payload: SignupPayload) => api.post<{ user: User }>('/auth/signup', payload),
  login: (payload: LoginPayload) => api.post<{ user: User }>('/auth/login', payload),
  logout: () => api.post('/auth/logout'),
  me: () => api.get<{ user: User }>('/auth/me'),
  updateProfile: (payload: Partial<User>) => api.put<{ user: User }>('/auth/profile', payload),
};
