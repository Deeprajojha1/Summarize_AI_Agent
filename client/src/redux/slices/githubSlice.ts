import { createSlice } from '@reduxjs/toolkit';
import type { GithubProfile } from '../../types/github.types';
import { fetchGithub } from '../thunks/githubThunk';

const githubSlice = createSlice({
  name: 'github',
  initialState: { profile: null as GithubProfile | null, loading: false, error: '' },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGithub.pending, (state) => { state.loading = true; state.error = ''; })
      .addCase(fetchGithub.fulfilled, (state, action) => { state.profile = action.payload; state.loading = false; state.error = ''; })
      .addCase(fetchGithub.rejected, (state, action) => {
        state.loading = false;
        state.profile = null;
        state.error = typeof action.payload === 'string' ? action.payload : 'Could not load GitHub data';
      });
  },
});

export default githubSlice.reducer;
