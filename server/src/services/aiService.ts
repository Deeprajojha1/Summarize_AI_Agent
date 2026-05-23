import { runAgent } from '../agents/aiAgent.js';

export const askAI = (message: string, userId: string) => runAgent(message, userId);
