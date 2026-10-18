import { useUserRepository } from '../../data/repositories';
import { updateProfileUseCase, type UpdateProfileInput } from '../../domain/useCases';

export function useUserUseCases() {
  const { repository, useCurrentUserQuery, isUpdating } = useUserRepository();

  return {
    useCurrentUserQuery,
    updateProfile: (input: UpdateProfileInput) => updateProfileUseCase(repository, input),
    isUpdating,
  };
}
