import Chat from '../models/Chat.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { askAI } from '../services/aiService.js';
import type { AuthRequest } from '../types/auth.types.js';

export const chat = asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user?.id || '';
  await Chat.create({ user: userId, role: 'user', content: req.body.message });
  const result = await askAI(req.body.message, userId);
  await Chat.create({ user: userId, role: 'assistant', content: result.answer, toolsUsed: result.toolsUsed });
  res.json(result);
});
