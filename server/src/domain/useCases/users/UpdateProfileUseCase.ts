import { NotFoundError } from '../../errors';
import { normalizeOptionalText } from '../../models/Task';
import { normalizeUserName, type User, type UserProfileChanges } from '../../models/User';
import type { UserRepository } from '../../ports/UserRepository';

export interface UpdateProfileInput {
  userId: string;
  changes: UserProfileChanges;
}

export class UpdateProfileUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute({ userId, changes }: UpdateProfileInput): Promise<User> {
    const normalized: UserProfileChanges = {
      name: changes.name === undefined ? undefined : normalizeUserName(changes.name),
      bio: normalizeOptionalText(changes.bio),
      avatar: normalizeOptionalText(changes.avatar),
    };

    const user = await this.users.updateProfile(userId, normalized);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }
}
