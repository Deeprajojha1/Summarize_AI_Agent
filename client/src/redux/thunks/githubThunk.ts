import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { githubApi } from '../../api/githubApi';

export const fetchGithub = createAsyncThunk('github/fetch', async (username: string, { rejectWithValue }) => {
  try {
    const { data } = await githubApi.getProfile(username);
    return data.profile;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || `Could not load GitHub data for ${username}`);
    }
    return rejectWithValue(`Could not load GitHub data for ${username}`);
  }
});
