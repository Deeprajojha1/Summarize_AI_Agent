import { createSlice } from '@reduxjs/toolkit';
import type { User } from '../../types/auth.types';
import { fetchMe, login, logout, signup, updateProfile } from '../thunks/authThunk';

type AuthState = { user: User | null; loading: boolean; hydrated: boolean };
const initialState: AuthState = { user: null, loading: false, hydrated: false };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => { state.loading = true; })
      .addCase(fetchMe.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; state.hydrated = true; })
      .addCase(fetchMe.rejected, (state) => { state.user = null; state.loading = false; state.hydrated = true; })
      .addCase(login.pending, (state) => { state.loading = true; })
      .addCase(login.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; state.hydrated = true; })
      .addCase(login.rejected, (state) => { state.loading = false; state.hydrated = true; })
      .addCase(signup.pending, (state) => { state.loading = true; })
      .addCase(signup.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; state.hydrated = true; })
      .addCase(signup.rejected, (state) => { state.loading = false; state.hydrated = true; })
      .addCase(logout.pending, (state) => { state.loading = true; })
      .addCase(logout.fulfilled, (state) => { state.user = null; state.loading = false; state.hydrated = true; })
      .addCase(logout.rejected, (state) => { state.loading = false; })
      .addCase(updateProfile.pending, (state) => { state.loading = true; })
      .addCase(updateProfile.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; })
      .addCase(updateProfile.rejected, (state) => { state.loading = false; });
  },
});

export default authSlice.reducer;
