import type { Profile } from '../models';
import type { ProfileRepository } from '../repositories';

export async function getCurrentUserUseCase(repository: ProfileRepository): Promise<Profile> {
  return repository.getCurrentUser();
}
