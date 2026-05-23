import { createSlice } from '@reduxjs/toolkit';
import type { ChatMessage } from '../../types/ai.types';
import { sendAIMessage } from '../thunks/aiThunk';

const welcome: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'I am NexFlow AI. Ask me about weather, tech news, GitHub activity, or your task plan.',
};

const aiSlice = createSlice({
  name: 'ai',
  initialState: { messages: [welcome] as ChatMessage[], suggestions: ['Summarize AI news today', 'Prioritize my tasks', 'Check GitHub activity'], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(sendAIMessage.pending, (state, action) => {
      state.loading = true;
      state.messages.push({ id: crypto.randomUUID(), role: 'user', content: action.meta.arg });
    }).addCase(sendAIMessage.fulfilled, (state, action) => {
      state.loading = false;
      state.messages.push({ id: crypto.randomUUID(), role: 'assistant', content: action.payload.response.answer, tools: action.payload.response.toolsUsed });
      state.suggestions = action.payload.response.suggestions;
    }).addCase(sendAIMessage.rejected, (state) => {
      state.loading = false;
      state.messages.push({ id: crypto.randomUUID(), role: 'assistant', content: 'I could not reach the AI agent right now. Check server API keys and try again.' });
    });
  },
});

export default aiSlice.reducer;
