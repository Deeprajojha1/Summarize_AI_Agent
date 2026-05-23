import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  status: z.enum(['todo', 'progress', 'done']).default('todo'),
  deadline: z.string().optional(),
  progress: z.number().min(0).max(100).default(0),
  category: z.string().optional(),
});
