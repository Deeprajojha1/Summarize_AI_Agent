import api from './axios';
import type { Task, TaskPayload } from '../types/task.types';

export const taskApi = {
  list: () => api.get<{ tasks: Task[] }>('/tasks'),
  create: (payload: TaskPayload) => api.post<{ task: Task }>('/tasks', payload),
  update: (id: string, payload: Partial<TaskPayload>) => api.patch<{ task: Task }>('/tasks/' + id, payload),
  remove: (id: string) => api.delete('/tasks/' + id),
};
