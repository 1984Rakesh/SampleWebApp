import { NotFoundError } from '../../../shared/domain/errors';
import type { Profile } from '../models';
import type { ProfileRepository } from '../ports';

export class GetCurrentUserUseCase {
  constructor(private readonly profiles: ProfileRepository) {}

  async execute(userId: string): Promise<Profile> {
    const profile = await this.profiles.findById(userId);
    if (!profile) throw new NotFoundError('User not found');
    return profile;
  }
}
