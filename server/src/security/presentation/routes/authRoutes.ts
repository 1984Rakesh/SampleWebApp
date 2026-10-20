import { Router } from 'express';
import type { AuthController } from '../controllers/AuthController';

export function createAuthRoutes(controller: AuthController): Router {
  const router = Router();

  router.post('/register', controller.register);
  router.post('/login', controller.login);
  router.post('/refresh', controller.refresh);

  return router;
}
