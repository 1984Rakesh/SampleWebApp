import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api';
import type { UpdateUserDTO } from '../dtos';
import { userToDomain, toUpdateUserDTO } from '../mappers';
import type { UserRepository } from '../../domain/repositories';
import { getCurrentUserUseCase } from '../../domain/useCases';

export function useUserRepository() {
  const queryClient = useQueryClient();

  const getCurrentUser = async () => {
    const dto = await userApi.getCurrentUser();
    return userToDomain(dto);
  };

  const updateMutation = useMutation({
    mutationFn: async (input: UpdateUserDTO) => {
      const response = await userApi.updateProfile(input);
      return userToDomain(response);
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['user'], user);
    },
  });

  const repository: UserRepository = {
    getCurrentUser,
    updateProfile: (input) => updateMutation.mutateAsync(toUpdateUserDTO(input)),
  };

  const useCurrentUserQuery = () =>
    useQuery({
      queryKey: ['user'],
      queryFn: () => getCurrentUserUseCase(repository),
    });

  return {
    repository,
    useCurrentUserQuery,
    isUpdating: updateMutation.isPending,
  };
}
