import type { AuthSession } from '../models';
import type { AuthRepository } from '../repositories';

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export async function registerUserUseCase(
  repository: AuthRepository,
  input: RegisterUserInput
): Promise<AuthSession> {
  if (!input.name || input.name.trim().length === 0) {
    throw new Error('Name is required');
  }

  if (!input.email || input.email.trim().length === 0) {
    throw new Error('Email is required');
  }

  if (!isValidEmail(input.email)) {
    throw new Error('Invalid email format');
  }

  if (!input.password || input.password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  return repository.register(input);
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
