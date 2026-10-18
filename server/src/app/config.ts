export interface AppConfig {
  port: number;
  isProduction: boolean;
  corsOrigin: string;
  dbPath: string;
  jwt: {
    secret: string;
    accessExpiresIn: string;
    refreshExpiresIn: string;
  };
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return {
    port: Number(env.PORT) || 3001,
    isProduction: env.NODE_ENV === 'production',
    corsOrigin: env.CORS_ORIGIN || 'http://localhost:5173',
    dbPath: env.DB_PATH || './database.sqlite',
    jwt: {
      secret: env.JWT_SECRET || 'your-super-secret-jwt-key',
      accessExpiresIn: env.JWT_EXPIRES_IN || '1h',
      refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
  };
}
