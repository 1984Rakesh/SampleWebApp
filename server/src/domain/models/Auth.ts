import type { User } from './User';

export interface TokenPayload {
  userId: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: User;
  tokens: AuthTokens;
}
