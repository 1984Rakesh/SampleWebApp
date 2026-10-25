import { useMutation } from '@tanstack/react-query';
import type { AuthRepository } from '../../domain/repositories';

export function useAuthRepository(source: AuthRepository) {
  const login = useMutation({ mutationFn: source.login });
  const register = useMutation({ mutationFn: source.register });
  const repository: AuthRepository = {
    login: (input) => login.mutateAsync(input),
    register: (input) => register.mutateAsync(input),
    refreshToken: source.refreshToken,
  };
  return { repository, isLoggingIn: login.isPending, isRegistering: register.isPending };
}
