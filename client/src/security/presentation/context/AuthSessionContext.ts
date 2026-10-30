import { createContext, useContext } from 'react';
import type { AuthSessionState } from '../contracts';

export type { AuthSessionState };
export const AuthSessionContext = createContext<AuthSessionState | undefined>(undefined);
export function useAuth(): AuthSessionState {
  const value = useContext(AuthSessionContext);
  if (!value) throw new Error('useAuth must be used within an AuthProvider');
  return value;
}
