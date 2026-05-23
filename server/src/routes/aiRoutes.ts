import { Router } from 'express';
import { z } from 'zod';
import { chat } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';

const router = Router();
router.post('/chat', protect, validate(z.object({ message: z.string().min(2) })), chat);
export default router;
