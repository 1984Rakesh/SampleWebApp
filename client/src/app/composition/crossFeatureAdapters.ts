import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { DashboardCapabilities } from '../../dashboard';
import type { ProfileFeature, ProfileTaskCounts } from '../../profile';
import type { SecurityFeature, SecuritySessionListener } from '../../security';
import type { TasksFeature } from '../../tasks';
import { accountToProfile } from './profileSession';

/** Clears user-scoped caches on session changes and seeds the profile cache after sign-in. */
export function useSessionListener(profile: ProfileFeature): SecuritySessionListener {
  const queryClient = useQueryClient();
  const cacheProfile = profile.useProfileCache();
  return useMemo(() => ({
    clearUserData: () => queryClient.clear(),
    sessionStarted: (account) => cacheProfile(accountToProfile(account)),
  }), [queryClient, cacheProfile]);
}

export function useProfileTaskCounts(tasks: TasksFeature): ProfileTaskCounts {
  const overview = tasks.useTaskOverview();
  return { created: overview.items.length, completed: overview.counts.completed, isLoading: overview.isLoading };
}

export function useDashboardCapabilities(
  security: SecurityFeature,
  tasks: TasksFeature,
  profile: ProfileFeature,
): DashboardCapabilities {
  const { user } = security.useSession();
  const overview = tasks.useTaskOverview();
  const current = profile.useCurrentProfile();

  const toggleTaskStatus = async (id: string) => {
    try {
      await overview.toggleStatus(id);
    } catch {
      // Dashboard does not surface toggle errors (unchanged behavior).
    }
  };

  return {
    profileName: current.profile?.name || user?.name || 'User',
    isProfileLoading: current.isLoading,
    taskItems: overview.items,
    counts: overview.counts,
    statusLabels: tasks.statusLabels,
    isTasksLoading: overview.isLoading,
    errorMessage: overview.errorMessage,
    toggleTaskStatus,
  };
}
