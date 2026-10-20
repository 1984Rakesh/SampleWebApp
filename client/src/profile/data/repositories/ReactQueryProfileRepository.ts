import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';
import type { ProfileRepository } from '../../domain/repositories/ProfileRepository';
import type { Profile } from '../../domain/models/Profile';
import { getCurrentUserUseCase } from '../../domain/useCases/GetCurrentUserUseCase';

const profileKey = (id?: string) => ['user', id];
export function cacheProfile(client: QueryClient, profile: Profile): void {
  client.setQueryData(profileKey(profile.id), profile);
}

export function useProfileRepository(source: ProfileRepository, identity?: string) {
  const queryClient = useQueryClient();
  const update = useMutation({
    mutationFn: source.updateProfile,
    onSuccess: (profile) => cacheProfile(queryClient, profile),
  });
  const repository: ProfileRepository = {
    getCurrentUser: source.getCurrentUser,
    updateProfile: (input) => update.mutateAsync(input),
  };
  const useCurrentUserQuery = () => useQuery({
    queryKey: profileKey(identity), enabled: !!identity,
    queryFn: () => getCurrentUserUseCase(repository),
  });
  return { repository, useCurrentUserQuery, isUpdating: update.isPending };
}
