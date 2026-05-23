import { createSlice } from '@reduxjs/toolkit';
import type { User } from '../../types/auth.types';
import { fetchMe, login, logout, signup } from '../thunks/authThunk';

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
      .addCase(login.fulfilled, (state, action) => { state.user = action.payload; })
      .addCase(signup.fulfilled, (state, action) => { state.user = action.payload; })
      .addCase(logout.fulfilled, (state) => { state.user = null; });
  },
});

export default authSlice.reducer;
