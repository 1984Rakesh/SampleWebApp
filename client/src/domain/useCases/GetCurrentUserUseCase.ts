import type { User } from '../models';
import type { UserRepository } from '../repositories';

export async function getCurrentUserUseCase(repository: UserRepository): Promise<User> {
  return repository.getCurrentUser();
}
