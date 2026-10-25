import express, { type Express } from 'express';
import cors from 'cors';
import { errorMiddleware, requestLogger } from '../foundation/http';
import type { AppConfig } from './config';
import type { Container } from './container';

export function createApp(config: AppConfig, { routers }: Container): Express {
  const app = express();

  // Middleware
  app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
  }));
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/', (_req, res) => {
    res.json({ message: 'Clean Architecture Learning App API' });
  });

  // API Routes
  if (!config.isProduction) {
    app.use('/api', requestLogger);
  }
  app.use('/api/auth', routers.auth);
  app.use('/api/users', routers.users);
  app.use('/api/tasks', routers.tasks);

  // Error handling middleware (must be last)
  app.use(errorMiddleware);

  return app;
}
