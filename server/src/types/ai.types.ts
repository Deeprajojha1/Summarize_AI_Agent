export type AgentResult = {
  answer: string;
  toolsUsed: string[];
  suggestions: string[];
};

export type AgentHistoryMessage = {
  role: 'user' | 'assistant';
  content: string;
};
