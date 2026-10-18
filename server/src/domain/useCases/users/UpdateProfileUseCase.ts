import { NotFoundError, ValidationError } from '../../errors';
import type { User, UserProfileChanges } from '../../models/User';
import type { UserRepository } from '../../ports/UserRepository';

export interface UpdateProfileInput {
  userId: string;
  changes: UserProfileChanges;
}

export class UpdateProfileUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute({ userId, changes }: UpdateProfileInput): Promise<User> {
    const name = changes.name?.trim();
    if (name === '') {
      throw new ValidationError('Name cannot be empty');
    }

    const user = await this.users.updateProfile(userId, { ...changes, name });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }
}
