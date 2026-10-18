import { Router, type RequestHandler } from 'express';
import type { UserController } from '../controllers/UserController';

export function createUserRoutes(controller: UserController, authMiddleware: RequestHandler): Router {
  const router = Router();

  // All user routes require authentication
  router.use(authMiddleware);

  router.get('/me', controller.getCurrentUser);
  router.put('/me', controller.updateProfile);

  return router;
}
