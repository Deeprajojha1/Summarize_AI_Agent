import { createAsyncThunk } from '@reduxjs/toolkit';
import { weatherApi } from '../../api/weatherApi';

export const fetchWeather = createAsyncThunk('weather/fetch', async (city: string) => {
  const { data } = await weatherApi.getWeather(city);
  return data.weather;
});
