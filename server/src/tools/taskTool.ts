import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import Task from '../models/Task.js';

export const createTaskTool = (userId: string) => new DynamicStructuredTool({
  name: 'task_tool',
  description: 'Read user tasks and produce productivity summaries, priorities, and reminders.',
  schema: z.object({ mode: z.enum(['summary', 'prioritize']).default('summary') }),
  func: async ({ mode }) => {
    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 }).limit(20);
    const open = tasks.filter((task) => task.status !== 'done');
    return JSON.stringify({ mode, total: tasks.length, open: open.length, urgent: tasks.filter((task) => task.priority === 'urgent').length, tasks });
  },
});
