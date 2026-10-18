import type { User } from '../models';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export async function loginUseCase(
  input: LoginInput
): Promise<LoginOutput> {
  if (!input.email || input.email.trim().length === 0) {
    throw new Error('Email is required');
  }

  if (!isValidEmail(input.email)) {
    throw new Error('Invalid email format');
  }

  if (!input.password || input.password.length === 0) {
    throw new Error('Password is required');
  }

  // This would normally call the repository/API
  throw new Error('Repository not implemented');
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
