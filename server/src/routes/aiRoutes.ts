import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { chat, uploadDocument } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post('/chat', protect, validate(z.object({ message: z.string().min(2) })), chat);
router.post('/documents', protect, upload.single('document'), uploadDocument);
export default router;
