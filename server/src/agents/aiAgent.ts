import { getGeminiModel } from '../config/gemini.js';
import { systemPrompt } from './promptTemplates.js';
import { selectTools } from './toolRegistry.js';
import type { AgentResult } from '../types/ai.types.js';

const inferArgs = (toolName: string, message: string) => {
  if (toolName.includes('weather')) {
    const match = message.match(/in ([a-zA-Z\s]+)$/);
    return { city: match?.[1]?.trim() || 'Bengaluru' };
  }
  if (toolName.includes('github')) {
    const match = message.match(/github\s+([a-zA-Z0-9-]+)/i) || message.match(/user\s+([a-zA-Z0-9-]+)/i);
    return { username: match?.[1] || 'octocat' };
  }
  if (toolName.includes('news')) return { category: /developer|coding|frontend/.test(message.toLowerCase()) ? 'developer' : 'ai' };
  return { mode: /priorit/.test(message.toLowerCase()) ? 'prioritize' : 'summary' };
};

export const runAgent = async (message: string, userId: string): Promise<AgentResult> => {
  const selectedTools = selectTools(message, userId);
  const observations: string[] = [];

  for (const tool of selectedTools.length ? selectedTools : selectTools('task news', userId).slice(0, 1)) {
    const result = await (tool as any).invoke(inferArgs(tool.name, message));
    observations.push(`${tool.name}: ${result}`);
  }

  const model = getGeminiModel();
  if (!model) {
    return {
      answer: `Demo AI response: I selected ${observations.map((item) => item.split(':')[0]).join(', ') || 'no external tools'} for your request. Add GEMINI_API_KEY in server/.env for live Gemini reasoning. Based on the available context, focus on urgent tasks, scan AI news for workflow impact, and keep one deep-work block protected today.`,
      toolsUsed: observations.map((item) => item.split(':')[0]),
      suggestions: ['Prioritize my urgent tasks', 'Show AI news impact', 'Check GitHub octocat'],
    };
  }

  const prompt = `${systemPrompt}\nUser request: ${message}\nTool observations:\n${observations.join('\n')}\nRespond in 2-4 concise paragraphs and include clear next actions.`;
  const response = await model.generateContent(prompt);
  return {
    answer: response.response.text(),
    toolsUsed: observations.map((item) => item.split(':')[0]),
    suggestions: ['What should I do next?', 'Summarize today in 3 bullets', 'Find risks in my task list'],
  };
};
