import { useUserRepository } from '../../data/repositories';
import type { UpdateUserInput } from '../../data/api';
import type { User } from '../../domain/models';

export function useUserViewModel() {
  const { useGetCurrentUserQuery, useUpdateProfileMutation } = useUserRepository();

  const userQuery = useGetCurrentUserQuery();
  const updateMutation = useUpdateProfileMutation();

  const updateProfile = async (input: UpdateUserInput) => {
    try {
      const result = await updateMutation.mutateAsync(input);
      return result;
    } catch (error) {
      throw error;
    }
  };

  return {
    user: userQuery.data as User | undefined,
    isLoading: userQuery.isLoading,
    error: userQuery.error,
    updateProfile,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
}
