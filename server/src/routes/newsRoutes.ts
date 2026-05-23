import { Router } from 'express';
import { news } from '../controllers/newsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/', protect, news);
export default router;
