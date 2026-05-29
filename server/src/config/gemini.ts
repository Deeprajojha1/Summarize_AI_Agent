import { GoogleGenerativeAI } from '@google/generative-ai';

export const getGeminiModelNames = () => {
  const configured = process.env.GEMINI_MODEL;
  return [...new Set([configured, 'gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash'].filter(Boolean) as string[])];
};

export const getGeminiModel = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenerativeAI(key).getGenerativeModel({ model: getGeminiModelNames()[0] });
};

export const generateGeminiText = async (prompt: string) => {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is missing');
  const client = new GoogleGenerativeAI(key);
  let lastError: unknown;

  for (const modelName of getGeminiModelNames()) {
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        const model = client.getGenerativeModel({ model: modelName });
        const response = await model.generateContent(prompt);
        return response.response.text();
      } catch (error) {
        lastError = error;
        if (attempt === 1) await new Promise((resolve) => { setTimeout(resolve, 650); });
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Gemini generation failed');
};
