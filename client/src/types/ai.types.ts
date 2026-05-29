export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tools?: string[];
};

export type AIResponse = {
  answer: string;
  toolsUsed: string[];
  suggestions: string[];
};

export type AIDocumentUploadResponse = {
  document: {
    id: string;
    filename: string;
  };
  message?: string;
};
