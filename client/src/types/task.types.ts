export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Task = {
  _id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: 'todo' | 'progress' | 'done';
  deadline?: string;
  progress: number;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TaskPayload = Omit<Task, '_id'>;
