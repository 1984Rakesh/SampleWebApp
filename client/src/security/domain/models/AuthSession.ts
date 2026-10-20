import type { Account } from './Account';

export interface AuthSession {
  user: Account;
  accessToken: string;
  refreshToken: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}
