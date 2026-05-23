import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';
import type { LoginPayload, SignupPayload, User } from '../../types/auth.types';

export const signup = createAsyncThunk('auth/signup', async (payload: SignupPayload) => {
  const { data } = await authApi.signup(payload);
  return data.user;
});

export const login = createAsyncThunk('auth/login', async (payload: LoginPayload) => {
  const { data } = await authApi.login(payload);
  return data.user;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await authApi.logout();
});

export const fetchMe = createAsyncThunk('auth/me', async () => {
  const { data } = await authApi.me();
  return data.user;
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (payload: Partial<User>) => {
  const { data } = await authApi.updateProfile(payload);
  return data.user;
});
