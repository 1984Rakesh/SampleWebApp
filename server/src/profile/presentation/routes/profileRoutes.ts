import { Router, type RequestHandler } from 'express';
import type { ProfileController } from '../controllers';

export function createProfileRoutes(controller: ProfileController, authMiddleware: RequestHandler): Router {
  const router = Router();

  // All user routes require authentication
  router.use(authMiddleware);

  router.get('/me', controller.getCurrentUser);
  router.put('/me', controller.updateProfile);

  return router;
}
