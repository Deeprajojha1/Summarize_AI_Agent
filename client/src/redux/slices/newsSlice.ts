import { createSlice } from '@reduxjs/toolkit';
import type { NewsArticle } from '../../types/news.types';
import { fetchNews } from '../thunks/newsThunk';

const newsSlice = createSlice({
  name: 'news',
  initialState: { articles: [] as NewsArticle[], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchNews.pending, (state) => { state.loading = true; })
      .addCase(fetchNews.fulfilled, (state, action) => { state.articles = action.payload; state.loading = false; })
      .addCase(fetchNews.rejected, (state) => { state.loading = false; });
  },
});

export default newsSlice.reducer;
