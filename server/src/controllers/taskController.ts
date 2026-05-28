import Task from '../models/Task.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import type { AuthRequest } from '../types/auth.types.js';
// tasks craeted by the user, not by the agent, so we can use the same controller for both. The agent will just call the API endpoints to manage tasks on behalf of the user.
export const listTasks = asyncHandler(async (req: AuthRequest, res) => {
  const tasks = await Task.find({ user: req.user?.id }).sort({ createdAt: -1 });
  res.json({ tasks });
});

export const createTask = asyncHandler(async (req: AuthRequest, res) => {
  const task = await Task.create({ ...req.body, user: req.user?.id });
  res.status(201).json({ task });
});

export const updateTask = asyncHandler(async (req: AuthRequest, res) => {
  const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user?.id }, req.body, { new: true });
  if (!task) { res.status(404); throw new Error('Task not found'); }
  res.json({ task });
});

export const deleteTask = asyncHandler(async (req: AuthRequest, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, user: req.user?.id });
  res.json({ message: 'Task deleted' });
});
