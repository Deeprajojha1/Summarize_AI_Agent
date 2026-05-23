import { createSlice } from '@reduxjs/toolkit';
import type { GithubProfile } from '../../types/github.types';
import { fetchGithub } from '../thunks/githubThunk';

const githubSlice = createSlice({
  name: 'github',
  initialState: { profile: null as GithubProfile | null, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGithub.pending, (state) => { state.loading = true; })
      .addCase(fetchGithub.fulfilled, (state, action) => { state.profile = action.payload; state.loading = false; })
      .addCase(fetchGithub.rejected, (state) => { state.loading = false; });
  },
});

export default githubSlice.reducer;
