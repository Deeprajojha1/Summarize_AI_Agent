import { createAsyncThunk } from '@reduxjs/toolkit';
import { aiApi } from '../../api/aiApi';

export const sendAIMessage = createAsyncThunk('ai/send', async (message: string) => {
  const { data } = await aiApi.chat(message);
  return { message, response: data };
});
