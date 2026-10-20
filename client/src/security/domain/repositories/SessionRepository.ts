import type { AuthSession } from '../models/AuthSession';
import type { Account } from '../models/Account';

export interface SessionRepository {
  getSession(): AuthSession | null;
  saveSession(session: AuthSession): void;
  updateAccount(account: Account): void;
  saveAccessToken(token: string): void;
  clearSession(): void;
  getVersion(): number;
  subscribe(listener: () => void): () => void;
}
