import { Router } from 'express';
import { login, logout, me, signup, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { loginSchema, signupSchema } from '../validations/authValidation.js';

const router = Router();
router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', protect, me);
router.put('/profile', protect, updateProfile);
export default router;
