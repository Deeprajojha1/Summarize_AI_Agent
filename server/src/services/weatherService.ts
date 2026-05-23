import axios from 'axios';

export const getWeather = async (city: string) => {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) {
    return { city, temperature: 28, humidity: 62, windSpeed: 9, condition: 'Demo clear sky', icon: '01d' };
  }
  const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', { params: { q: city, appid: key, units: 'metric' } });
  return {
    city: data.name,
    temperature: data.main.temp,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    condition: data.weather?.[0]?.description || 'Unknown',
    icon: data.weather?.[0]?.icon || '01d',
  };
};
