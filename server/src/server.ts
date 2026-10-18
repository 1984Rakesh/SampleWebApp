import 'dotenv/config';
import { loadConfig } from './app/config';
import { createContainer } from './app/container';
import { createApp } from './app/createApp';
import { runMigrations } from './infrastructure/database/migrations';
import { seedDatabase } from './infrastructure/database/seed';

// Initialize database and start server
function startServer(): void {
  try {
    const config = loadConfig();
    const container = createContainer(config);

    // Run migrations
    runMigrations(container.db);

    // Seed database
    seedDatabase(container.db);

    createApp(config, container).listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
      console.log(`CORS origin: ${config.corsOrigin}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
