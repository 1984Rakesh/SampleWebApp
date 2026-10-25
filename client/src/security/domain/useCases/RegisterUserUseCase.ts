import type { AuthSession, RegisterUserInput } from '../models';
import type { AuthRepository } from '../repositories';
import { normalizeEmail, normalizeName, ValidationError } from '../../../shared/domain';

export async function registerUserUseCase(repository: AuthRepository, input: RegisterUserInput): Promise<AuthSession> {
  if (!input.name?.trim()) throw new ValidationError('Name is required');
  const name = normalizeName(input.name);
  const email = normalizeEmail(input.email);
  if (!input.password || input.password.length < 6) throw new ValidationError('Password must be at least 6 characters');
  return repository.register({ name, email, password: input.password });
}
