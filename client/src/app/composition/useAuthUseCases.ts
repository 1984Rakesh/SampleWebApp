import { useAuthRepository } from '../../security/data/repositories/ReactQueryAuthRepository';
import { loginUseCase } from '../../security/domain/useCases/LoginUseCase';
import { registerUserUseCase } from '../../security/domain/useCases/RegisterUserUseCase';
import type { LoginInput, RegisterUserInput } from '../../security/domain/models/AuthSession';
import { authRepository } from './securityRuntime';

export function useAuthUseCases() {
  const { repository, isLoggingIn, isRegistering } = useAuthRepository(authRepository);
  return {
    login: (input: LoginInput) => loginUseCase(repository, input),
    register: (input: RegisterUserInput) => registerUserUseCase(repository, input),
    isLoggingIn, isRegistering,
  };
}
