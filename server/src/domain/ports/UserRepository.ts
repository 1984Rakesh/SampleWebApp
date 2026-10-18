import type { NewUser, User, UserCredentials, UserProfileChanges } from '../models/User';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findCredentialsByEmail(email: string): Promise<UserCredentials | null>;
  create(user: NewUser): Promise<User>;
  updateProfile(id: string, changes: UserProfileChanges): Promise<User | null>;
}
