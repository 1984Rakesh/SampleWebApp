import { useUserRepository } from '../../data/repositories';
import { updateProfileUseCase, type UpdateProfileInput } from '../../domain/useCases';
import { useAuth } from '../context';

export function useUserUseCases() {
  const { repository, useCurrentUserQuery, isUpdating } = useUserRepository();
  const { updateUser } = useAuth();

  return {
    useCurrentUserQuery,
    updateProfile: async (input: UpdateProfileInput) => {
      const updated = await updateProfileUseCase(repository, input);
      updateUser(updated);
      return updated;
    },
    isUpdating,
  };
}
