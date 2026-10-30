import { lazy, useCallback, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { AxiosInstance } from 'axios';
import { createProfileApi } from './data/api';
import { bindProfileSession, cacheProfile, createProfileRepository, useProfileRepository } from './data/repositories';
import type { Profile } from './domain/models';
import type { ProfileSession } from './domain/repositories';
import { updateProfileUseCase } from './domain/useCases';
import { ProfileUseCasesContext, type ProfileUseCases } from './presentation/context';
import {
  ProfileRoute,
  type CurrentProfileState,
  type ProfileFeature,
  type ProfileStatusLabels,
  type ProfileTaskCounts,
} from './presentation/contracts';

export interface ProfileFeatureDependencies {
  http: AxiosInstance;
  session: ProfileSession;
  /** Signed-in user id that scopes profile queries (client §3.3). */
  useCurrentUserId(): string | undefined;
  useTaskCounts(): ProfileTaskCounts;
  statusLabels: ProfileStatusLabels;
}

/** Builds the profile feature's internals from App-supplied cross-feature dependencies (shared §10). */
export function createProfileFeature(deps: ProfileFeatureDependencies): ProfileFeature {
  const ProfileScreen = lazy(() => import('./presentation/screens').then((m) => ({ default: m.ProfileScreen })));

  const source = bindProfileSession(createProfileRepository(createProfileApi(deps.http)), deps.session);

  function useUserUseCases(): ProfileUseCases {
    const { repository, useCurrentUserQuery, isUpdating } = useProfileRepository(source, deps.useCurrentUserId());
    return {
      useCurrentUserQuery,
      useTaskCounts: deps.useTaskCounts,
      statusLabels: deps.statusLabels,
      updateProfile: (input) => updateProfileUseCase(repository, input),
      isUpdating,
    };
  }

  function ProfileProvider({ children }: { children: ReactNode }) {
    return <ProfileUseCasesContext.Provider value={useUserUseCases()}>{children}</ProfileUseCasesContext.Provider>;
  }

  function useCurrentProfile(): CurrentProfileState {
    const query = useUserUseCases().useCurrentUserQuery();
    return { profile: query.data, isLoading: query.isLoading };
  }

  function useProfileCache(): (profile: Profile) => void {
    const queryClient = useQueryClient();
    return useCallback((profile: Profile) => cacheProfile(queryClient, profile), [queryClient]);
  }

  return {
    routes: [{ path: ProfileRoute.profile, element: <ProfileScreen /> }],
    Provider: ProfileProvider,
    useCurrentProfile,
    useProfileCache,
  };
}
