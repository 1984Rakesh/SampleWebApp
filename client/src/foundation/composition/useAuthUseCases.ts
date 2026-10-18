import { useAuthRepository } from '../../data/repositories';
import {
  loginUseCase,
  registerUserUseCase,
  type LoginInput,
  type RegisterUserInput,
} from '../../domain/useCases';

export function useAuthUseCases() {
  const { repository, isLoggingIn, isRegistering } = useAuthRepository();

  return {
    login: (input: LoginInput) => loginUseCase(repository, input),
    register: (input: RegisterUserInput) => registerUserUseCase(repository, input),
    isLoggingIn,
    isRegistering,
  };
}
