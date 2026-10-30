import type { Account, AuthSession } from '../../domain/models';

export interface AuthSessionState {
  user: Account | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setSession(session: AuthSession): void;
  signOut(): void;
}
