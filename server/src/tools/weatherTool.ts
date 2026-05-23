import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { getWeather } from '../services/weatherService.js';

export const weatherTool = new DynamicStructuredTool({
  name: 'weather_tool',
  description: 'Fetch current weather by city for planning and context-aware suggestions.',
  schema: z.object({ city: z.string().default('Bengaluru') }),
  func: async ({ city }) => JSON.stringify(await getWeather(city)),
});
