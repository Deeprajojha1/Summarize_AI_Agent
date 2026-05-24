import { createSlice } from '@reduxjs/toolkit';
import type { Weather } from '../../types/weather.types';
import { fetchWeather } from '../thunks/weatherThunk';

const weatherSlice = createSlice({
  name: 'weather',
  initialState: { data: null as Weather | null, city: 'Bengaluru', loading: false, error: '' },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchWeather.pending, (state) => { state.loading = true; state.error = ''; })
      .addCase(fetchWeather.fulfilled, (state, action) => { state.data = action.payload; state.city = action.payload.city; state.loading = false; state.error = ''; })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        state.error = typeof action.payload === 'string' ? action.payload : 'Could not load real weather data';
      });
  },
});

export default weatherSlice.reducer;
