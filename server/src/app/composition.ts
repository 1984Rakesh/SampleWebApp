import { createDatabase, seedDatabase, type DatabaseConnection } from '../foundation/database';
import type { HttpRouter } from '../foundation/http';
import { createProfileFeature } from '../profile';
import { createSecurityFeature } from '../security';
import { createTasksFeature } from '../tasks';
import type { AppConfig } from './config';

export interface Composition {
  db: DatabaseConnection;
  seed: () => Promise<void>;
  routers: {
    auth: HttpRouter;
    users: HttpRouter;
    tasks: HttpRouter;
  };
}

/** Supplies cross-feature dependencies to each feature assembly (shared §10); features build their own internals. */
export function createComposition(config: AppConfig): Composition {
  const db = createDatabase(config.dbPath);

  const security = createSecurityFeature({ db, jwt: config.jwt });
  const profile = createProfileFeature({ db, authMiddleware: security.authMiddleware });
  const tasks = createTasksFeature({ db, authMiddleware: security.authMiddleware });

  return {
    db,
    seed: () => seedDatabase(db, security.hashPassword),
    routers: {
      auth: security.router,
      users: profile.router,
      tasks: tasks.router,
    },
  };
}
