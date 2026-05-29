import { createSlice } from '@reduxjs/toolkit';
import type { ChatMessage } from '../../types/ai.types';
import { sendAIMessage, uploadAIDocument } from '../thunks/aiThunk';

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
    uploadLoading: false,
    uploadedDocuments: [] as Array<{ id: string; filename: string }>,
  },
  reducers: {
    resetChat: (state) => {
      state.messages = [welcome];
      state.suggestions = ['What should I focus on today?', 'Summarize AI news', 'Check GitHub activity', 'Prioritize my tasks'];
      state.loading = false;
      state.uploadLoading = false;
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
    }).addCase(sendAIMessage.rejected, (state, action) => {
      state.loading = false;
      state.messages.push({ id: crypto.randomUUID(), role: 'assistant', content: action.error.message || 'I could not reach the AI agent right now. Check server API keys and try again.' });
    }).addCase(uploadAIDocument.pending, (state, action) => {
      state.uploadLoading = true;
      state.messages.push({ id: crypto.randomUUID(), role: 'user', content: `Attached document: ${action.meta.arg.name}` });
    }).addCase(uploadAIDocument.fulfilled, (state, action) => {
      state.uploadLoading = false;
      state.uploadedDocuments.push(action.payload.response.document);
      state.messages.push({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `${action.payload.fileName} is ready. Ask me anything about it.`,
      });
    }).addCase(uploadAIDocument.rejected, (state, action) => {
      state.uploadLoading = false;
      state.messages.push({ id: crypto.randomUUID(), role: 'assistant', content: action.error.message || 'I could not upload this document yet. Please try again after the document API is available.' });
    });
  },
});

export const { resetChat } = aiSlice.actions;
export default aiSlice.reducer;
