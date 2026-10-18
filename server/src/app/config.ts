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

const DEFAULT_DEV_JWT_SECRET = 'your-super-secret-jwt-key';

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const isProduction = env.NODE_ENV === 'production';
  const jwtSecret = env.JWT_SECRET || DEFAULT_DEV_JWT_SECRET;

  if (isProduction && (!env.JWT_SECRET || env.JWT_SECRET === DEFAULT_DEV_JWT_SECRET)) {
    throw new Error('JWT_SECRET must be explicitly configured in production');
  }

  return {
    port: Number(env.PORT) || 3001,
    isProduction,
    corsOrigin: env.CORS_ORIGIN || 'http://localhost:5173',
    dbPath: env.DB_PATH || './database.sqlite',
    jwt: {
      secret: jwtSecret,
      accessExpiresIn: env.JWT_EXPIRES_IN || '1h',
      refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
  };
}
