import type { AuthSession } from '../models';
import type { LoginInput } from '../useCases/LoginUseCase';
import type { RegisterUserInput } from '../useCases/RegisterUserUseCase';

export interface AuthRepository {
  login(input: LoginInput): Promise<AuthSession>;
  register(input: RegisterUserInput): Promise<AuthSession>;
}
