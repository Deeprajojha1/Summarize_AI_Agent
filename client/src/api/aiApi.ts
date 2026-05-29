import api from './axios';
import type { AIDocumentUploadResponse, AIResponse } from '../types/ai.types';

export const aiApi = {
  chat: (message: string) => api.post<AIResponse>('/ai/chat', { message }, { timeout: 120000 }),
  uploadDocument: (file: File) => {
    const formData = new FormData();
    formData.append('document', file);

    return api.post<AIDocumentUploadResponse>('/ai/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
    });
  },
};
