import { createContext, useContext } from 'react';
import type { Profile, UpdateProfileInput } from '../../domain/models';
import type { ProfileStatusLabels, ProfileTaskCounts } from '../contracts';

export interface ProfileUseCases {
  useCurrentUserQuery(): { data: Profile | undefined; isLoading: boolean; error: Error | null };
  useTaskCounts(): ProfileTaskCounts;
  statusLabels: ProfileStatusLabels;
  updateProfile(input: UpdateProfileInput): Promise<Profile>;
  isUpdating: boolean;
}
export const ProfileUseCasesContext = createContext<ProfileUseCases | undefined>(undefined);
export function useUserUseCases(): ProfileUseCases {
  const value = useContext(ProfileUseCasesContext);
  if (!value) throw new Error('Profile use cases must be supplied by App');
  return value;
}
