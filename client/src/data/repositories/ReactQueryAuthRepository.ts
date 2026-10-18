import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api';
import { authResponseToDomain } from '../mappers';
import type { AuthRepository } from '../../domain/repositories';
import type { LoginInput, RegisterUserInput } from '../../domain/useCases';

export function useAuthRepository() {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (input: LoginInput) => {
      const response = await authApi.login(input);
      return authResponseToDomain(response);
    },
    onSuccess: (session) => {
      queryClient.setQueryData(['user'], session.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (input: RegisterUserInput) => {
      const response = await authApi.register(input);
      return authResponseToDomain(response);
    },
    onSuccess: (session) => {
      queryClient.setQueryData(['user'], session.user);
    },
  });

  const repository: AuthRepository = {
    login: (input) => loginMutation.mutateAsync(input),
    register: (input) => registerMutation.mutateAsync(input),
  };

  return {
    repository,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
}
