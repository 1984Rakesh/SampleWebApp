import { Router, type RequestHandler } from 'express';
import type { TaskController } from '../controllers';

export function createTaskRoutes(controller: TaskController, authMiddleware: RequestHandler): Router {
  const router = Router();

  // All task routes require authentication
  router.use(authMiddleware);

  router.get('/', controller.getTasks);
  router.post('/', controller.createTask);
  router.put('/:id', controller.updateTask);
  router.delete('/:id', controller.deleteTask);
  router.patch('/:id/status', controller.toggleStatus);

  return router;
}
