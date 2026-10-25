import type { Profile, ProfileChanges } from '../models';

export interface ProfileRepository {
  findById(id: string): Promise<Profile | null>;
  updateProfile(id: string, changes: ProfileChanges): Promise<Profile | null>;
}
