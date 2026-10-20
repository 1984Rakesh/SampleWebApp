import type { Profile } from '../models/Profile';
import type { ProfileRepository } from '../repositories/ProfileRepository';

export async function getCurrentUserUseCase(repository: ProfileRepository): Promise<Profile> {
  return repository.getCurrentUser();
}
