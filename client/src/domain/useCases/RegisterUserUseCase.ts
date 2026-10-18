import { isValidEmail, type AuthSession, type RegisterUserInput } from '../models';
import type { AuthRepository } from '../repositories';

export type { RegisterUserInput };

export async function registerUserUseCase(
  repository: AuthRepository,
  input: RegisterUserInput
): Promise<AuthSession> {
  const name = input.name?.trim() ?? '';
  if (!name) {
    throw new Error('Name is required');
  }

  const email = input.email?.trim() ?? '';
  if (!email) {
    throw new Error('Email is required');
  }

  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }

  if (!input.password || input.password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  return repository.register({ name, email, password: input.password });
}
