import api from './axios';
import type { NewsArticle } from '../types/news.types';

export const newsApi = {
  getNews: (category = 'ai') => api.get<{ articles: NewsArticle[] }>('/news', { params: { category } }),
};
