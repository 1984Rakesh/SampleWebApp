import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { runMigrations } from './database/migrations';
import { seedDatabase } from './database/seed';
import { errorMiddleware } from './middleware/errorMiddleware';
import { requestLogger } from './middleware/requestLogger';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
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
if (process.env.NODE_ENV !== 'production') {
  app.use('/api', requestLogger);
}
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Error handling middleware (must be last)
app.use(errorMiddleware);

// Initialize database and start server
async function startServer() {
  try {
    // Run migrations
    runMigrations();

    // Seed database
    seedDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`CORS origin: ${CORS_ORIGIN}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
