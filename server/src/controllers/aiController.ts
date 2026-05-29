import Chat from '../models/Chat.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { askAI } from '../services/aiService.js';
import { ingestDocument } from '../services/documentService.js';
import type { AuthRequest } from '../types/auth.types.js';
import { logger } from '../utils/logger.js';

export const chat = asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user?.id || '';
  const history = await Chat.find({ user: userId }).sort({ createdAt: -1 }).limit(8).select('role content').lean();
  await Chat.create({ user: userId, role: 'user', content: req.body.message });
  const result = await askAI(req.body.message, userId, history.reverse().map((item) => ({ role: item.role as 'user' | 'assistant', content: item.content })));
  await Chat.create({ user: userId, role: 'assistant', content: result.answer, toolsUsed: result.toolsUsed });
  res.json(result);
});

export const uploadDocument = asyncHandler(async (req: AuthRequest, res) => {
  const file = req.file;
  if (!file) {
    res.status(400);
    throw new Error('Document file is required');
  }

  logger.info('Document upload received', { filename: file.originalname, mimetype: file.mimetype, size: file.size });
  const document = await ingestDocument(file, req.user?.id || '');
  logger.info('Document upload indexed', document);
  res.status(201).json({
    document: {
      id: document.id,
      filename: document.filename,
      chunkCount: document.chunkCount,
    },
    message: `${document.filename} is indexed in MongoDB with ${document.chunkCount} chunks. Ask a question from this document.`,
  });
});
