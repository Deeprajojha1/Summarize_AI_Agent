import { createSlice } from '@reduxjs/toolkit';
import type { NewsArticle } from '../../types/news.types';
import { fetchNews } from '../thunks/newsThunk';

const newsSlice = createSlice({
  name: 'news',
  initialState: { articles: [] as NewsArticle[], loading: false, error: '' },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchNews.pending, (state) => { state.loading = true; state.error = ''; })
      .addCase(fetchNews.fulfilled, (state, action) => { state.articles = action.payload; state.loading = false; state.error = ''; })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.articles = [];
        state.error = typeof action.payload === 'string' ? action.payload : 'Could not load real news data';
      });
  },
});

export default newsSlice.reducer;
