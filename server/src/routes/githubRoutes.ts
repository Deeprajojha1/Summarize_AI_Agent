import { Router } from 'express';
import { githubProfile } from '../controllers/githubController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/:username', protect, githubProfile);
export default router;
