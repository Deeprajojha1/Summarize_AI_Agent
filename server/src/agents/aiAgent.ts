import { getGeminiModel } from '../config/gemini.js';
import User from '../models/User.js';
import { getWeather } from '../services/weatherService.js';
import { systemPrompt } from './promptTemplates.js';
import { selectTools } from './toolRegistry.js';
import type { AgentResult } from '../types/ai.types.js';

type AgentProfile = {
  name?: string;
  githubUsername?: string;
  currentAddress?: string;
};

const extractCity = (message: string) => {
  const cleaned = message.replace(/[?.!]+$/g, '').trim();
  const locationMatches = [...cleaned.matchAll(/\b(?:in|at|for|of)\s+([a-zA-Z\s]+?)(?=\s+(?:weather|temperature|current|today|now)\b|$)/gi)];

  for (const match of locationMatches.reverse()) {
    const city = match[1]
      ?.split(/\b(?:in|at|for|of)\b/i)
      .pop()
      ?.replace(/\b(?:current|weather|temperature|today|now|the)\b/gi, '')
      .trim();
    if (city) return city;
  }

  return undefined;
};

const inferArgs = (toolName: string, message: string, profile: AgentProfile) => {
  if (toolName.includes('weather')) {
    return { city: extractCity(message) || profile.currentAddress || 'Bengaluru' };
  }
  if (toolName.includes('github')) {
    const match = message.match(/github\s+([a-zA-Z0-9-]+)/i) || message.match(/user\s+([a-zA-Z0-9-]+)/i);
    return { username: match?.[1] || profile.githubUsername || 'octocat' };
  }
  if (toolName.includes('news')) return { category: /developer|coding|frontend/.test(message.toLowerCase()) ? 'developer' : 'ai' };
  return { mode: /priorit/.test(message.toLowerCase()) ? 'prioritize' : 'summary' };
};

const toolNames = (observations: string[]) => observations.map((item) => item.split(':')[0]);

const getObservationData = (observations: string[], toolName: string) => {
  const observation = observations.find((item) => item.startsWith(`${toolName}:`));
  if (!observation) return null;

  try {
    return JSON.parse(observation.slice(observation.indexOf(':') + 1).trim());
  } catch {
    return null;
  }
};

const formatDate = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const buildFallbackAnswer = (message: string, observations: string[], profile: AgentProfile) => {
  const text = observations.join('\n').toLowerCase();

  if (text.includes('weather_tool')) {
    const weather = getObservationData(observations, 'weather_tool') as {
      city?: string;
      temperature?: number;
      humidity?: number;
      windSpeed?: number;
      condition?: string;
      error?: string;
    } | null;

    if (weather?.error) {
      return `I could not fetch the current weather for "${extractCity(message) || profile.currentAddress || 'your city'}": ${weather.error}`;
    }

    if (weather) {
      const city = weather.city || extractCity(message) || profile.currentAddress || 'your city';
      const details = [
        weather.condition ? `${weather.condition}` : null,
        typeof weather.temperature === 'number' ? `${weather.temperature} C` : null,
        typeof weather.humidity === 'number' ? `${weather.humidity}% humidity` : null,
        typeof weather.windSpeed === 'number' ? `${weather.windSpeed} m/s wind` : null,
      ].filter(Boolean).join(', ');

      return `Current weather in ${city}: ${details || 'weather data is available, but some details are missing.'}`;
    }

    return `I used the Weather tool for your question: "${message}", but the weather result was not readable. Please try again with a city name like "weather in Roorkee".`;
  }

  if (text.includes('github_tool')) {
    const github = getObservationData(observations, 'github_tool') as {
      username?: string;
      followers?: number;
      publicRepos?: number;
      totalStars?: number;
      repositories?: Array<{ name?: string; stars?: number; forks?: number; language?: string; updatedAt?: string }>;
      source?: string;
      error?: string;
    } | null;

    if (github?.error) return `I could not fetch GitHub details: ${github.error}`;
    if (github) {
      const repos = github.repositories?.slice(0, 3).map((repo) => {
        const parts = [
          repo.name || 'Unnamed repo',
          repo.language || null,
          typeof repo.stars === 'number' ? `${repo.stars} stars` : null,
          formatDate(repo.updatedAt) ? `updated ${formatDate(repo.updatedAt)}` : null,
        ].filter(Boolean);
        return parts.join(' - ');
      }) || [];

      return [
        `GitHub summary for ${github.username || profile.githubUsername || 'the selected user'}: ${github.publicRepos ?? 0} public repositories, ${github.followers ?? 0} followers, and ${github.totalStars ?? 0} total stars across the latest repos.`,
        repos.length ? `Top recent repos: ${repos.join('; ')}.` : 'No public repositories were found.',
      ].filter(Boolean).join('\n\n');
    }
  }

  if (text.includes('news_tool')) {
    const news = getObservationData(observations, 'news_tool') as Array<{
      title?: string;
      source?: string;
      summary?: string;
      publishedAt?: string;
      category?: string;
    }> | null;

    if (Array.isArray(news) && news.length) {
      const headlines = news.slice(0, 3).map((item, index) => {
        const date = formatDate(item.publishedAt);
        return `${index + 1}. ${item.title || 'Technology update'}${item.source ? ` (${item.source})` : ''}${date ? ` - ${date}` : ''}: ${item.summary || 'No summary available.'}`;
      }).join('\n');

      return `Here are the latest ${news[0]?.category || 'technology'} updates:\n\n${headlines}`;
    }
  }

  if (text.includes('task_tool')) {
    const taskData = getObservationData(observations, 'task_tool') as {
      mode?: string;
      total?: number;
      open?: number;
      urgent?: number;
      tasks?: Array<{ title?: string; priority?: string; status?: string; deadline?: string }>;
      error?: string;
    } | null;

    if (taskData?.error) return `I could not read your task list: ${taskData.error}`;
    if (taskData) {
      const openTasks = taskData.tasks?.filter((task) => task.status !== 'done').slice(0, 4) || [];
      const taskLines = openTasks.map((task, index) => {
        const deadline = formatDate(task.deadline);
        return `${index + 1}. ${task.title || 'Untitled task'} - ${task.priority || 'normal'} priority${deadline ? `, due ${deadline}` : ''}`;
      }).join('\n');

      return `Task summary: ${taskData.open ?? 0} open out of ${taskData.total ?? 0} total tasks, with ${taskData.urgent ?? 0} urgent tasks.\n\n${taskLines || 'No open tasks found.'}`;
    }
  }

  return `I could not find a matching tool result for your question: "${message}". Please ask about weather, GitHub, news, or tasks.`;
};

export const runAgent = async (message: string, userId: string): Promise<AgentResult> => {
  const user = await User.findById(userId).select('name githubUsername currentAddress');
  const profile: AgentProfile = {
    name: user?.get('name'),
    githubUsername: user?.get('githubUsername') || undefined,
    currentAddress: user?.get('currentAddress') || undefined,
  };
  const selectedTools = selectTools(message, userId);
  const observations: string[] = [];
  const weatherSelected = selectedTools.some((tool) => tool.name.includes('weather'));

  if (weatherSelected) {
    try {
      const args = inferArgs('weather_tool', message, profile) as { city: string };
      const result = await getWeather(args.city);
      observations.push(`weather_tool: ${JSON.stringify(result)}`);
    } catch (error) {
      observations.push(`weather_tool: ${JSON.stringify({ error: error instanceof Error ? error.message : 'Tool failed' })}`);
    }
  }

  for (const tool of selectedTools.length ? selectedTools.filter((item) => !item.name.includes('weather')) : selectTools('task news', userId).slice(0, 1)) {
    try {
      const result = await (tool as any).invoke(inferArgs(tool.name, message, profile));
      observations.push(`${tool.name}: ${result}`);
    } catch (error) {
      observations.push(`${tool.name}: ${JSON.stringify({ error: error instanceof Error ? error.message : 'Tool failed' })}`);
    }
  }

  const deterministicAnswer = buildFallbackAnswer(message, observations, profile);
  if (selectedTools.length) {
    return {
      answer: deterministicAnswer,
      toolsUsed: toolNames(observations),
      suggestions: ['What should I do next?', 'Summarize today in 3 bullets', 'Find risks in my task list'],
    };
  }

  const model = getGeminiModel();
  if (!model) {
    return {
      answer: deterministicAnswer,
      toolsUsed: toolNames(observations),
      suggestions: ['Track my GitHub projects', 'Use my address for weather', 'Prioritize my urgent tasks'],
    };
  }

  try {
    const prompt = `${systemPrompt}\nUser profile context:\n- Name: ${profile.name || 'Unknown'}\n- GitHub username: ${profile.githubUsername || 'Not provided'}\n- Current address/city: ${profile.currentAddress || 'Not provided'}\n\nOriginal user question:\n${message}\n\nTool observations:\n${observations.join('\n')}\n\nAnswer instructions:\n- Answer the original user question directly first.\n- Use exact facts from the tool observations.\n- Do not write generic productivity advice unless the user asked for planning or productivity help.\n- If weather data is present, include city, condition, temperature, humidity, and wind speed.\n- Keep the answer concise.`;
    const response = await model.generateContent(prompt);
    return {
      answer: response.response.text(),
      toolsUsed: toolNames(observations),
      suggestions: ['What should I do next?', 'Summarize today in 3 bullets', 'Find risks in my task list'],
    };
  } catch {
    return {
      answer: deterministicAnswer,
      toolsUsed: toolNames(observations),
      suggestions: ['Track my GitHub projects', 'Use my address for weather', 'Prioritize my urgent tasks'],
    };
  }
};
