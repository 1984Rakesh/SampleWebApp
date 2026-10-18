import type { User } from '../models';
import type { UserRepository } from '../repositories';

export interface UpdateProfileInput {
  name?: string;
  bio?: string;
  avatar?: string;
}

export async function updateProfileUseCase(
  repository: UserRepository,
  input: UpdateProfileInput
): Promise<User> {
  if (input.name !== undefined && input.name.trim().length === 0) {
    throw new Error('Name cannot be empty');
  }

  return repository.updateProfile(input);
}
