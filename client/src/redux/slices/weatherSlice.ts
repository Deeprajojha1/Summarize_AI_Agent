import { createSlice } from '@reduxjs/toolkit';
import type { Weather } from '../../types/weather.types';
import { fetchWeather } from '../thunks/weatherThunk';

const weatherSlice = createSlice({
  name: 'weather',
  initialState: { data: null as Weather | null, city: 'Bengaluru', loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchWeather.pending, (state) => { state.loading = true; })
      .addCase(fetchWeather.fulfilled, (state, action) => { state.data = action.payload; state.city = action.payload.city; state.loading = false; })
      .addCase(fetchWeather.rejected, (state) => { state.loading = false; });
  },
});

export default weatherSlice.reducer;
