import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api';
import { userToDomain, userToDTO } from '../mappers';
import type { UpdateUserInput } from '../api';

export function useUserRepository() {
  const queryClient = useQueryClient();

  const useGetCurrentUserQuery = () =>
    useQuery({
      queryKey: ['user'],
      queryFn: async () => {
        const dto = await userApi.getCurrentUser();
        return userToDomain(dto);
      },
    });

  const useUpdateProfileMutation = () =>
    useMutation({
      mutationFn: async (input: UpdateUserInput) => {
        const dto = userToDTO(input);
        const response = await userApi.updateProfile(dto);
        return userToDomain(response);
      },
      onSuccess: (user) => {
        queryClient.setQueryData(['user'], user);
      },
    });

  return {
    useGetCurrentUserQuery,
    useUpdateProfileMutation,
  };
}
