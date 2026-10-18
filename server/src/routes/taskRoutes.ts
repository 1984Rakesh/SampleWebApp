import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask, toggleStatus } from '../controllers/TaskController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// All task routes require authentication
router.use(authMiddleware);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/status', toggleStatus);

export default router;
