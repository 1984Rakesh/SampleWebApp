import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api';
import { authResponseToDomain, toLoginRequestDTO, toRegisterRequestDTO } from '../mappers';
import type { LoginInput, RegisterUserInput } from '../../domain/models';
import type { AuthRepository } from '../../domain/repositories';

export function useAuthRepository() {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (input: LoginInput) => {
      const response = await authApi.login(toLoginRequestDTO(input));
      return authResponseToDomain(response);
    },
    onSuccess: (session) => {
      queryClient.setQueryData(['user'], session.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (input: RegisterUserInput) => {
      const response = await authApi.register(toRegisterRequestDTO(input));
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
