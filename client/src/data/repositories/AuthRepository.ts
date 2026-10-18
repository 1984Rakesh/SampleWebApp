import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api';
import { userToDomain } from '../mappers';
import type { LoginInput, RegisterUserInput } from '../../domain/useCases';

export function useAuthRepository() {
  const queryClient = useQueryClient();

  const useLoginMutation = () =>
    useMutation({
      mutationFn: async (input: LoginInput) => {
        const response = await authApi.login(input);
        const user = userToDomain(response.user);
        return { user, accessToken: response.accessToken, refreshToken: response.refreshToken };
      },
      onSuccess: (data) => {
        queryClient.setQueryData(['user'], data.user);
      },
    });

  const useRegisterMutation = () =>
    useMutation({
      mutationFn: async (input: RegisterUserInput) => {
        const response = await authApi.register(input);
        const user = userToDomain(response.user);
        return { user, accessToken: response.accessToken, refreshToken: response.refreshToken };
      },
      onSuccess: (data) => {
        queryClient.setQueryData(['user'], data.user);
      },
    });

  const useRefreshTokenMutation = () =>
    useMutation({
      mutationFn: async (refreshToken: string) => {
        const response = await authApi.refreshToken(refreshToken);
        return response.accessToken;
      },
    });

  const useLogoutMutation = () =>
    useMutation({
      mutationFn: async () => {
        // Clear local storage and query cache
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        queryClient.clear();
      },
    });

  return {
    useLoginMutation,
    useRegisterMutation,
    useRefreshTokenMutation,
    useLogoutMutation,
  };
}
