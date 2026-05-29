import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { aiApi } from '../../api/aiApi';

export const sendAIMessage = createAsyncThunk('ai/send', async (message: string) => {
  try {
    const { data } = await aiApi.chat(message);
    return { message, response: data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data;
      if (typeof data === 'string' && data.trim()) throw new Error(data);
      throw new Error(data?.message || error.message || 'AI request failed');
    }
    throw error;
  }
});

export const uploadAIDocument = createAsyncThunk('ai/uploadDocument', async (file: File) => {
  try {
    const { data } = await aiApi.uploadDocument(file);
    return { fileName: file.name, response: data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data;
      if (typeof data === 'string' && data.trim()) throw new Error(data);
      throw new Error(data?.message || error.message || 'Document upload failed');
    }
    throw error;
  }
});
