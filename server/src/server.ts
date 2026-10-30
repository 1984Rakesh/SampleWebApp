import 'dotenv/config';
import { loadConfig } from './app/config';
import { createComposition } from './app/composition';
import { createApp } from './app/createApp';
import { runMigrations } from './foundation/database';

// Initialize database and start server
async function startServer(): Promise<void> {
  try {
    const config = loadConfig();
    const composition = createComposition(config);

    // Run migrations
    runMigrations(composition.db);

    // Seed database
    await composition.seed();

    createApp(config, composition).listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
      console.log(`CORS origin: ${config.corsOrigin}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

void startServer();
