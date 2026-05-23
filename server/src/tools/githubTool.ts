import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { getGithubProfile } from '../services/githubService.js';

export const githubTool = new DynamicStructuredTool({
  name: 'github_tool',
  description: 'Fetch GitHub repositories, stats, and activity by username.',
  schema: z.object({ username: z.string().default('octocat') }),
  func: async ({ username }) => JSON.stringify(await getGithubProfile(username)),
});
