import type { Profile, UpdateProfileInput } from '../models/Profile';

export interface ProfileRepository {
  getCurrentUser(): Promise<Profile>;
  updateProfile(input: UpdateProfileInput): Promise<Profile>;
}
