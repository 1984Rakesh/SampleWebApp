import { Router } from 'express';
import { getCurrentUser, updateProfile } from '../controllers/UserController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

router.get('/me', getCurrentUser);
router.put('/me', updateProfile);

export default router;
