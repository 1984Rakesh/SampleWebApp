import type { AuthSession, LoginInput } from '../models';
import type { AuthRepository } from '../repositories';
import { normalizeEmail } from '../../../shared/domain/validation';
import { ValidationError } from '../../../shared/domain/errors';

export async function loginUseCase(repository: AuthRepository, input: LoginInput): Promise<AuthSession> {
  const email = normalizeEmail(input.email);
  if (!input.password) throw new ValidationError('Password is required');
  return repository.login({ email, password: input.password });
}
