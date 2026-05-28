import { GoogleGenerativeAI } from '@google/generative-ai';

export const getGeminiModel = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenerativeAI(key).getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.5-flash' });
};
