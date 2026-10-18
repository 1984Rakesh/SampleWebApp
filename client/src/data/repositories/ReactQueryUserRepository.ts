import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api';
import type { UpdateUserDTO } from '../dtos';
import { userToDomain, toUpdateUserDTO } from '../mappers';
import type { UserRepository } from '../../domain/repositories';

export function useUserRepository() {
  const queryClient = useQueryClient();

  const useCurrentUserQuery = () =>
    useQuery({
      queryKey: ['user'],
      queryFn: async () => {
        const dto = await userApi.getCurrentUser();
        return userToDomain(dto);
      },
    });

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
    updateProfile: (input) => updateMutation.mutateAsync(toUpdateUserDTO(input)),
  };

  return {
    repository,
    useCurrentUserQuery,
    isUpdating: updateMutation.isPending,
  };
}
