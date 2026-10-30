import type { ComponentType, ReactNode } from 'react';
import type { RouteObject } from 'react-router-dom';
import type { Profile } from '../../domain/models';

export interface CurrentProfileState {
  profile: Profile | undefined;
  isLoading: boolean;
}

/** What the profile assembly hands to App (shared §10). */
export interface ProfileFeature {
  routes: RouteObject[];
  Provider: ComponentType<{ children: ReactNode }>;
  useCurrentProfile(): CurrentProfileState;
  /** Returns a stable callback that seeds the current-profile cache, e.g. right after sign-in. */
  useProfileCache(): (profile: Profile) => void;
}
