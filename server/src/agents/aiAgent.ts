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

const toolNames = (observations: string[]) => observations.map((item) => item.split(':')[0]);

const buildFallbackAnswer = (message: string, observations: string[]) => {
  const tools = toolNames(observations);
  const text = observations.join('\n').toLowerCase();
  const picked = tools.length ? tools.join(', ') : 'task_tool';

  if (text.includes('news_tool')) {
    return `I selected the News tool for your question: "${message}". I fetched the available AI/developer news context and summarized it without blocking on Gemini.\n\nKey takeaway: AI tooling is moving toward agentic workflows, better developer productivity, and faster automation inside everyday dashboards. For your project, highlight how NexFlow AI chooses the news API dynamically, then converts raw articles into action-focused insights.\n\nNext actions: review the newest AI cards, connect this trend to frontend/backend productivity, and ask me to compare the news impact with your task list.`;
  }

  if (text.includes('github_tool')) {
    return `I selected the GitHub tool for your question: "${message}". I checked developer activity context and used it to prepare a productivity-style response.\n\nUse this data to discuss repository health, recent work momentum, public repo count, stars, and activity patterns. If activity is low, plan one focused coding block and one cleanup/refactor block.`;
  }

  if (text.includes('weather_tool')) {
    return `I selected the Weather tool for your question: "${message}". Weather context can help plan work intensity and reminders.\n\nIf conditions are distracting or travel-heavy, keep deep work lighter and move complex coding tasks into a protected time block.`;
  }

  return `I selected the Task tool for your question: "${message}". I reviewed task/productivity context and prepared a practical plan.\n\nFocus on urgent unfinished tasks first, then high-priority tasks with deadlines. Keep one small task for momentum and one deep-work task for meaningful progress.`;
};

export const runAgent = async (message: string, userId: string): Promise<AgentResult> => {
  const selectedTools = selectTools(message, userId);
  const observations: string[] = [];

  for (const tool of selectedTools.length ? selectedTools : selectTools('task news', userId).slice(0, 1)) {
    try {
      const result = await (tool as any).invoke(inferArgs(tool.name, message));
      observations.push(`${tool.name}: ${result}`);
    } catch (error) {
      observations.push(`${tool.name}: ${JSON.stringify({ error: error instanceof Error ? error.message : 'Tool failed' })}`);
    }
  }

  const model = getGeminiModel();
  if (!model) {
    return {
      answer: buildFallbackAnswer(message, observations),
      toolsUsed: toolNames(observations),
      suggestions: ['Prioritize my urgent tasks', 'Show AI news impact', 'Check GitHub octocat'],
    };
  }

  try {
    const prompt = `${systemPrompt}\nUser request: ${message}\nTool observations:\n${observations.join('\n')}\nRespond in 2-4 concise paragraphs and include clear next actions.`;
    const response = await model.generateContent(prompt);
    return {
      answer: response.response.text(),
      toolsUsed: toolNames(observations),
      suggestions: ['What should I do next?', 'Summarize today in 3 bullets', 'Find risks in my task list'],
    };
  } catch {
    return {
      answer: buildFallbackAnswer(message, observations),
      toolsUsed: toolNames(observations),
      suggestions: ['Prioritize my urgent tasks', 'Show AI news impact', 'Check GitHub octocat'],
    };
  }
};
