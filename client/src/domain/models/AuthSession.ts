import type { User } from './User';

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
}
