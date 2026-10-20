import { NotFoundError } from '../../../shared/domain/errors';
import { normalizeOptionalText } from '../../../shared/domain/normalizeOptionalText';
import { normalizeUserName } from '../../../shared/domain/normalizeUserName';
import type { Profile, ProfileChanges, UpdateProfileInput } from '../models/Profile';
import type { ProfileRepository } from '../ports/ProfileRepository';

export class UpdateProfileUseCase {
  constructor(private readonly profiles: ProfileRepository) {}

  async execute({ userId, changes }: UpdateProfileInput): Promise<Profile> {
    const normalized: ProfileChanges = {
      name: changes.name === undefined ? undefined : normalizeUserName(changes.name),
      bio: normalizeOptionalText(changes.bio),
      avatar: normalizeOptionalText(changes.avatar),
    };
    const profile = await this.profiles.updateProfile(userId, normalized);
    if (!profile) throw new NotFoundError('User not found');
    return profile;
  }
}
