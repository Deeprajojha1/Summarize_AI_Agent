import axios from 'axios';

export const normalizeWeatherCity = (city: string) => {
  const cleaned = city
    .replace(/[?.!]+$/g, '')
    .replace(/\b(?:current|weather|temperature|today|now|the)\b/gi, '')
    .trim();

  const nestedLocation = cleaned.split(/\b(?:in|at|for|of)\b/i).pop()?.trim();
  return nestedLocation || cleaned || 'Bengaluru';
};

export const getWeather = async (city: string) => {
  const normalizedCity = normalizeWeatherCity(city);
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) {
    throw new Error('OpenWeather API key is missing. Real weather data cannot be fetched.');
  }
  let data;
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', { params: { q: normalizedCity, appid: key, units: 'metric' } });
    data = response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Weather lookup failed for "${normalizedCity}" (${error.response?.status || 'network error'})`);
    }
    throw error;
  }

  return {
    city: data.name,
    temperature: data.main.temp,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    condition: data.weather?.[0]?.description || 'Unknown',
    icon: data.weather?.[0]?.icon || '01d',
  };
};
