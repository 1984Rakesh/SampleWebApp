import { z } from 'zod';
import type { UserResponse } from './UserDto';

const requiredText = (message: string) =>
  z.string({ error: message }).trim().min(1, { error: message });

const REGISTER_REQUIRED = 'Name, email, and password are required';
const LOGIN_REQUIRED = 'Email and password are required';

export const registerBodySchema = z.object({
  name: requiredText(REGISTER_REQUIRED),
  email: requiredText(REGISTER_REQUIRED),
  password: z.string({ error: REGISTER_REQUIRED }).min(1, { error: REGISTER_REQUIRED }),
});

export const loginBodySchema = z.object({
  email: requiredText(LOGIN_REQUIRED),
  password: z.string({ error: LOGIN_REQUIRED }).min(1, { error: LOGIN_REQUIRED }),
});

export const refreshBodySchema = z.object({
  refreshToken: requiredText('Refresh token is required'),
});

export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}
