import type { User, UpdateProfileInput } from '../models';

export interface UserRepository {
  getCurrentUser(): Promise<User>;
  updateProfile(input: UpdateProfileInput): Promise<User>;
}
