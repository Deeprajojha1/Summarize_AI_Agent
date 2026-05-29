import { runAgent } from '../agents/aiAgent.js';
import type { AgentHistoryMessage } from '../types/ai.types.js';

export const askAI = (message: string, userId: string, history: AgentHistoryMessage[] = []) => runAgent(message, userId, history);
