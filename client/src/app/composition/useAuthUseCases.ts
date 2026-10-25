import { useAuthRepository } from '../../security/data/repositories';
import { loginUseCase, registerUserUseCase } from '../../security/domain/useCases';
import type { LoginInput, RegisterUserInput } from '../../security/domain/models';
import { authRepository } from './securityRuntime';

export function useAuthUseCases() {
  const { repository, isLoggingIn, isRegistering } = useAuthRepository(authRepository);
  return {
    login: (input: LoginInput) => loginUseCase(repository, input),
    register: (input: RegisterUserInput) => registerUserUseCase(repository, input),
    isLoggingIn, isRegistering,
  };
}
