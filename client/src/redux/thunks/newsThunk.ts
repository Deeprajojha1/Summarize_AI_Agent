import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { newsApi } from '../../api/newsApi';

export const fetchNews = createAsyncThunk('news/fetch', async (category: string, { rejectWithValue }) => {
  try {
    const { data } = await newsApi.getNews(category);
    return data.articles;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || 'Could not load real news data');
    }
    return rejectWithValue('Could not load real news data');
  }
});
