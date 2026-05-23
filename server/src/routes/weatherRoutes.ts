import { Router } from 'express';
import { weather } from '../controllers/weatherController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/', protect, weather);
export default router;
