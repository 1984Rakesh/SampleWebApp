import type { Profile, UpdateProfileInput } from '../models';
import type { ProfileRepository } from '../repositories';
import { normalizeName, normalizeOptionalText } from '../../../shared/domain/validation';

export async function updateProfileUseCase(repository: ProfileRepository, input: UpdateProfileInput): Promise<Profile> {
  return repository.updateProfile({
    name: input.name === undefined ? undefined : normalizeName(input.name),
    bio: normalizeOptionalText(input.bio),
    avatar: normalizeOptionalText(input.avatar),
  });
}
