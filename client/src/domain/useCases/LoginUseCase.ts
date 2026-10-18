import type { AuthSession } from '../models';
import type { AuthRepository } from '../repositories';

export interface LoginInput {
  email: string;
  password: string;
}

export async function loginUseCase(
  repository: AuthRepository,
  input: LoginInput
): Promise<AuthSession> {
  if (!input.email || input.email.trim().length === 0) {
    throw new Error('Email is required');
  }

  if (!isValidEmail(input.email)) {
    throw new Error('Invalid email format');
  }

  if (!input.password || input.password.length === 0) {
    throw new Error('Password is required');
  }

  return repository.login(input);
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
