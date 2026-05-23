import axios from 'axios';
import { compactText } from '../utils/helpers.js';

export const getTechNews = async (category = 'ai') => {
  const key = process.env.NEWS_API_KEY;
  if (!key) {
    return [
      { title: 'Demo: AI agents reshape developer workflows', source: 'NexFlow Demo', url: '#', description: 'Connect NewsAPI for live data.', summary: 'AI tools are moving from chat into autonomous workflow orchestration.', publishedAt: new Date().toISOString(), category },
      { title: 'Demo: Frontend teams adopt command-center dashboards', source: 'NexFlow Demo', url: '#', description: 'Demo article.', summary: 'Unified dashboards help developers reduce context switching.', publishedAt: new Date().toISOString(), category: 'developer' },
    ];
  }
  const query = category === 'developer' ? 'software development OR programming' : 'artificial intelligence OR AI';
  const { data } = await axios.get('https://newsapi.org/v2/everything', { params: { q: query, sortBy: 'publishedAt', pageSize: 8, apiKey: key, language: 'en' } });
  return data.articles.map((item: any) => ({
    title: item.title,
    source: item.source?.name || 'Unknown',
    url: item.url,
    description: item.description || '',
    summary: compactText(item.description || item.content || item.title),
    publishedAt: item.publishedAt,
    category,
  }));
};
