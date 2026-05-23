import axios from 'axios';
import { compactText } from '../utils/helpers.js';

const fallbackNews = (category: string) => [
  {
    title: 'AI agents are becoming productivity copilots for developers',
    source: 'NexFlow Intelligence',
    url: 'https://news.google.com/search?q=AI%20agents%20developer%20productivity',
    description: 'Fallback intelligence shown when the live NewsAPI request is unavailable.',
    summary: 'AI agents are moving beyond chat into task planning, code assistance, workflow automation, and dashboard-native recommendations.',
    publishedAt: new Date().toISOString(),
    category,
  },
  {
    title: 'Developer tools are shifting toward unified command centers',
    source: 'NexFlow Intelligence',
    url: 'https://news.google.com/search?q=developer%20tools%20AI%20dashboard',
    description: 'Fallback developer trend summary.',
    summary: 'Modern developer platforms are combining repositories, tasks, analytics, incidents, and AI assistants into one operating surface.',
    publishedAt: new Date().toISOString(),
    category: 'developer',
  },
  {
    title: 'Frontend teams are adopting AI-assisted workflows',
    source: 'NexFlow Intelligence',
    url: 'https://news.google.com/search?q=AI%20frontend%20development%20trends',
    description: 'Fallback frontend trend summary.',
    summary: 'AI-assisted frontend workflows are helping teams move faster with design iteration, code generation, testing, and review automation.',
    publishedAt: new Date().toISOString(),
    category: 'frontend',
  },
];

export const getTechNews = async (category = 'ai') => {
  const key = process.env.NEWS_API_KEY;
  if (!key) return fallbackNews(category);

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
    if (!articles.length) return fallbackNews(category);

    return articles.map((item: any, index: number) => ({
      title: item.title || `Technology update ${index + 1}`,
      source: item.source?.name || 'Unknown',
      url: item.url || `https://news.google.com/search?q=${encodeURIComponent(query)}`,
      description: item.description || '',
      summary: compactText(item.description || item.content || item.title || 'AI and developer technology update.'),
      publishedAt: item.publishedAt || new Date().toISOString(),
      category,
    }));
  } catch {
    return fallbackNews(category);
  }
};
