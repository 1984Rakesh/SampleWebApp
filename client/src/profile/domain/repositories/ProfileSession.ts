import type { Profile } from '../models';

/** Consumer-owned view of the signed-in session; App adapts the security session to it. */
export interface ProfileSession {
  getProfile(): Profile | null;
  getVersion(): number;
  updateProfile(profile: Profile): void;
}
