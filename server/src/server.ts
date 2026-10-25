import 'dotenv/config';
import { loadConfig } from './app/config';
import { createContainer } from './app/container';
import { createApp } from './app/createApp';
import { runMigrations } from './foundation/database';

// Initialize database and start server
async function startServer(): Promise<void> {
  try {
    const config = loadConfig();
    const container = createContainer(config);

    // Run migrations
    runMigrations(container.db);

    // Seed database
    await container.seed();

    createApp(config, container).listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
      console.log(`CORS origin: ${config.corsOrigin}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

void startServer();
