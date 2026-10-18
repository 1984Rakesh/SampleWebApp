import { NotFoundError } from '../../errors';
import type { User } from '../../models/User';
import type { UserRepository } from '../../ports/UserRepository';

export class GetCurrentUserUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }
}
