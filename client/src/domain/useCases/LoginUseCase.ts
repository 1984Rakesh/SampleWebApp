import { isValidEmail, type AuthSession, type LoginInput } from '../models';
import type { AuthRepository } from '../repositories';

export type { LoginInput };

export async function loginUseCase(
  repository: AuthRepository,
  input: LoginInput
): Promise<AuthSession> {
  const email = input.email?.trim() ?? '';
  if (!email) {
    throw new Error('Email is required');
  }

  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }

  if (!input.password || input.password.length === 0) {
    throw new Error('Password is required');
  }

  return repository.login({ email, password: input.password });
}
