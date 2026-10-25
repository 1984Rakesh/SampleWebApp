import type { Profile, UpdateProfileInput } from '../models';

export interface ProfileRepository {
  getCurrentUser(): Promise<Profile>;
  updateProfile(input: UpdateProfileInput): Promise<Profile>;
}
