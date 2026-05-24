import axios from 'axios';
import { compactText } from '../utils/helpers.js';

export const getTechNews = async (category = 'ai') => {
  const key = process.env.NEWS_API_KEY;
  if (!key) throw new Error('News API key is missing. Real news data cannot be fetched.');

  try {
    const query = category === 'developer' ? 'software development programming' : 'artificial intelligence AI startups';
    const { data } = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        searchIn: 'title,description',
        sortBy: 'publishedAt',
        pageSize: 8,
        apiKey: key,
        language: 'en',
      },
    });

    const articles = Array.isArray(data.articles) ? data.articles : [];
    if (!articles.length) return [];

    return articles.map((item: any, index: number) => ({
      title: item.title || `Technology update ${index + 1}`,
      source: item.source?.name || 'Unknown',
      url: item.url || `https://news.google.com/search?q=${encodeURIComponent(query)}`,
      description: item.description || '',
      summary: compactText(item.description || item.content || item.title || 'AI and developer technology update.'),
      publishedAt: item.publishedAt || new Date().toISOString(),
      category,
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`News lookup failed (${error.response?.status || 'network error'})`);
    }
    throw error;
  }
};
