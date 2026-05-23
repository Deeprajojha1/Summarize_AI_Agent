import { createSlice } from '@reduxjs/toolkit';
import type { ChatMessage } from '../../types/ai.types';
import { sendAIMessage } from '../thunks/aiThunk';

const welcome: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi there! I'm NexFlow Bot. Ask me anything about tasks, AI news, weather, GitHub activity, or productivity planning.",
};

const aiSlice = createSlice({
  name: 'ai',
  initialState: {
    messages: [welcome] as ChatMessage[],
    suggestions: ['What should I focus on today?', 'Summarize AI news', 'Check GitHub activity', 'Prioritize my tasks'],
    loading: false,
  },
  reducers: {
    resetChat: (state) => {
      state.messages = [welcome];
      state.suggestions = ['What should I focus on today?', 'Summarize AI news', 'Check GitHub activity', 'Prioritize my tasks'];
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sendAIMessage.pending, (state, action) => {
      state.loading = true;
      state.messages.push({ id: crypto.randomUUID(), role: 'user', content: action.meta.arg });
    }).addCase(sendAIMessage.fulfilled, (state, action) => {
      state.loading = false;
      state.messages.push({ id: crypto.randomUUID(), role: 'assistant', content: action.payload.response.answer, tools: action.payload.response.toolsUsed });
      state.suggestions = action.payload.response.suggestions.length ? action.payload.response.suggestions : state.suggestions;
    }).addCase(sendAIMessage.rejected, (state) => {
      state.loading = false;
      state.messages.push({ id: crypto.randomUUID(), role: 'assistant', content: 'I could not reach the AI agent right now. Check server API keys and try again.' });
    });
  },
});

export const { resetChat } = aiSlice.actions;
export default aiSlice.reducer;
