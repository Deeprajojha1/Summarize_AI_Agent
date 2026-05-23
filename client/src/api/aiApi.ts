import api from './axios';
import type { AIResponse } from '../types/ai.types';

export const aiApi = {
  chat: (message: string) => api.post<AIResponse>('/ai/chat', { message }),
};
