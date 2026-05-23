import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { getTechNews } from '../services/newsService.js';

export const newsTool = new DynamicStructuredTool({
  name: 'news_tool',
  description: 'Fetch current AI, developer, and technology news.',
  schema: z.object({ category: z.string().default('ai') }),
  func: async ({ category }) => JSON.stringify(await getTechNews(category)),
});
