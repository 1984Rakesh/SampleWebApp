import type { Account, AuthSession } from '../models';

export interface SessionRepository {
  getSession(): AuthSession | null;
  saveSession(session: AuthSession): void;
  updateAccount(account: Account): void;
  saveAccessToken(token: string): void;
  clearSession(): void;
  getVersion(): number;
  subscribe(listener: () => void): () => void;
}
