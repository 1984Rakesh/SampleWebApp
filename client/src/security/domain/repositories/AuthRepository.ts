import type { AuthSession, LoginInput, RegisterUserInput } from '../models';

export interface AuthRepository {
  login(input: LoginInput): Promise<AuthSession>;
  register(input: RegisterUserInput): Promise<AuthSession>;
  refreshToken(refreshToken: string): Promise<string>;
}
