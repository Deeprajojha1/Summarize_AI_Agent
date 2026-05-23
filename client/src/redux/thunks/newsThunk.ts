import { createAsyncThunk } from '@reduxjs/toolkit';
import { newsApi } from '../../api/newsApi';

export const fetchNews = createAsyncThunk('news/fetch', async (category: string) => {
  const { data } = await newsApi.getNews(category);
  return data.articles;
});
