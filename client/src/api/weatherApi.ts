import api from './axios';
import type { Weather } from '../types/weather.types';

export const weatherApi = {
  getWeather: (city: string) => api.get<{ weather: Weather }>('/weather', { params: { city } }),
};
