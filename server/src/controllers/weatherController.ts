import { asyncHandler } from '../middleware/asyncHandler.js';
import { getWeather } from '../services/weatherService.js';

export const weather = asyncHandler(async (req, res) => {
  const city = String(req.query.city || 'Bengaluru');
  res.json({ weather: await getWeather(city) });
});
