import { createContext, useContext } from 'react';
import type { Account, AuthSession } from '../../domain/models';

export interface AuthSessionState {
  user: Account | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setSession(session: AuthSession): void;
  signOut(): void;
}
export const AuthSessionContext = createContext<AuthSessionState | undefined>(undefined);
export function useAuth(): AuthSessionState {
  const value = useContext(AuthSessionContext);
  if (!value) throw new Error('useAuth must be used within an AuthProvider');
  return value;
}
