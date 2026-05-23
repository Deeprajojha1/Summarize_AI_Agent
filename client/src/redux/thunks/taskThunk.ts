import { createAsyncThunk } from '@reduxjs/toolkit';
import { taskApi } from '../../api/taskApi';
import type { TaskPayload } from '../../types/task.types';

export const fetchTasks = createAsyncThunk('tasks/fetch', async () => {
  const { data } = await taskApi.list();
  return data.tasks;
});

export const createTask = createAsyncThunk('tasks/create', async (payload: TaskPayload) => {
  const { data } = await taskApi.create(payload);
  return data.task;
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, payload }: { id: string; payload: Partial<TaskPayload> }) => {
  const { data } = await taskApi.update(id, payload);
  return data.task;
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id: string) => {
  await taskApi.remove(id);
  return id;
});
