import { NotFoundError } from '../../../shared/domain/errors';
import type { Profile } from '../models/Profile';
import type { ProfileRepository } from '../ports/ProfileRepository';

export class GetCurrentUserUseCase {
  constructor(private readonly profiles: ProfileRepository) {}

  async execute(userId: string): Promise<Profile> {
    const profile = await this.profiles.findById(userId);
    if (!profile) throw new NotFoundError('User not found');
    return profile;
  }
}
