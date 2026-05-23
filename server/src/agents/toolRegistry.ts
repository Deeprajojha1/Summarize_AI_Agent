import { githubTool } from '../tools/githubTool.js';
import { newsTool } from '../tools/newsTool.js';
import { createTaskTool } from '../tools/taskTool.js';
import { weatherTool } from '../tools/weatherTool.js';

export const getTools = (userId: string) => [weatherTool, newsTool, githubTool, createTaskTool(userId)];

export const selectTools = (message: string, userId: string) => {
  const text = message.toLowerCase();
  const tools = getTools(userId);
  return tools.filter((tool) => {
    if (tool.name.includes('weather')) return /weather|temperature|rain|city|humidity/.test(text);
    if (tool.name.includes('news')) return /news|ai|trend|technology|developer|today/.test(text);
    if (tool.name.includes('github')) return /github|repo|commit|developer|stars|activity/.test(text);
    if (tool.name.includes('task')) return /task|todo|priority|reminder|productivity|plan/.test(text);
    return false;
  });
};
