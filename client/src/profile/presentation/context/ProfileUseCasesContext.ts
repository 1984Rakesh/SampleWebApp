import { createContext, useContext } from 'react';
import type { Profile, UpdateProfileInput } from '../../domain/models';

export interface ProfileStatusLabels {
  completed: string;
}

export interface ProfileUseCases {
  useCurrentUserQuery(): { data: Profile | undefined; isLoading: boolean; error: Error | null };
  useTaskCounts(): { created: number; completed: number; isLoading: boolean };
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
