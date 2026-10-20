import type { Profile, ProfileChanges } from '../models/Profile';

export interface ProfileRepository {
  findById(id: string): Promise<Profile | null>;
  updateProfile(id: string, changes: ProfileChanges): Promise<Profile | null>;
}
