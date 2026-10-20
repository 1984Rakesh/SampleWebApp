import { createContext, useContext } from 'react';
import type { AuthSession, LoginInput, RegisterUserInput } from '../../domain/models/AuthSession';

export interface AuthUseCases {
  login(input: LoginInput): Promise<AuthSession>;
  register(input: RegisterUserInput): Promise<AuthSession>;
  isLoggingIn: boolean;
  isRegistering: boolean;
}
export const AuthUseCasesContext = createContext<AuthUseCases | undefined>(undefined);
export function useAuthUseCases(): AuthUseCases {
  const value = useContext(AuthUseCasesContext);
  if (!value) throw new Error('Auth use cases must be supplied by App');
  return value;
}
