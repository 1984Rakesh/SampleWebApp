import type { User, UpdateProfileInput } from '../models';
import type { UserRepository } from '../repositories';

export type { UpdateProfileInput };

export async function updateProfileUseCase(
  repository: UserRepository,
  input: UpdateProfileInput
): Promise<User> {
  if (input.name !== undefined && input.name.trim().length === 0) {
    throw new Error('Name cannot be empty');
  }

  return repository.updateProfile({
    ...input,
    name: input.name !== undefined ? input.name.trim() : undefined,
  });
}
