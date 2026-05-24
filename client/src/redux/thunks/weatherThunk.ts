import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { weatherApi } from '../../api/weatherApi';

export const fetchWeather = createAsyncThunk('weather/fetch', async (city: string, { rejectWithValue }) => {
  try {
    const { data } = await weatherApi.getWeather(city);
    return data.weather;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || `Could not load real weather data for ${city}`);
    }
    return rejectWithValue(`Could not load real weather data for ${city}`);
  }
});
