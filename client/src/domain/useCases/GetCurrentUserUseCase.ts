import type { User } from '../models';

export async function getCurrentUserUseCase(): Promise<User> {
  // This would normally call the repository/API
  throw new Error('Repository not implemented');
}
