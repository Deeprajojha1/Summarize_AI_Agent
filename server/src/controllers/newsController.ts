import { asyncHandler } from '../middleware/asyncHandler.js';
import { getTechNews } from '../services/newsService.js';

export const news = asyncHandler(async (req, res) => {
  res.json({ articles: await getTechNews(String(req.query.category || 'ai')) });
});
