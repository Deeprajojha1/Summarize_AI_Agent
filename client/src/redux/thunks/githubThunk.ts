import { createAsyncThunk } from '@reduxjs/toolkit';
import { githubApi } from '../../api/githubApi';

export const fetchGithub = createAsyncThunk('github/fetch', async (username: string) => {
  const { data } = await githubApi.getProfile(username);
  return data.profile;
});
