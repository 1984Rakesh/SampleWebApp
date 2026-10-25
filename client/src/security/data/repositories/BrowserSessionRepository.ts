import type { Account, AuthSession } from '../../domain/models';
import type { SessionRepository } from '../../domain/repositories';
import type { KeyValueStorage } from '../../../foundation/session';
import { authToDomain } from '../mappers';
import { UnauthorizedError } from '../../../shared/domain/errors';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

export class BrowserSessionRepository implements SessionRepository {
  private snapshot: AuthSession | null = null;
  private signature = '';
  private version = 0;
  private listeners = new Set<() => void>();

  constructor(private readonly storage: KeyValueStorage) {}

  getSession = (): AuthSession | null => {
    const values = [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY].map((key) => this.storage.getItem(key));
    const signature = JSON.stringify(values);
    if (signature === this.signature) return this.snapshot;
    this.signature = signature;
    const [accessToken, refreshToken, user] = values;
    if (!accessToken || !refreshToken || !user) {
      this.clear(false);
      return null;
    }
    try {
      this.snapshot = authToDomain({ accessToken, refreshToken, user: JSON.parse(user) });
      return this.snapshot;
    } catch {
      this.clear(false);
      return null;
    }
  };

  saveSession(session: AuthSession): void {
    const valid = authToDomain(session);
    this.storage.setItem(ACCESS_TOKEN_KEY, valid.accessToken);
    this.storage.setItem(REFRESH_TOKEN_KEY, valid.refreshToken);
    this.storage.setItem(USER_KEY, JSON.stringify(valid.user));
    this.version++;
    this.notify();
  }

  updateAccount(account: Account): void {
    const current = this.getSession();
    if (!current || current.user.id !== account.id) return;
    this.storage.setItem(USER_KEY, JSON.stringify(account));
    this.notify();
  }

  saveAccessToken(token: string): void {
    if (!this.getSession()) throw new UnauthorizedError('Session has ended');
    this.storage.setItem(ACCESS_TOKEN_KEY, token);
    this.notify();
  }

  clearSession(): void { this.clear(true); }
  getVersion = (): number => this.version;
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };

  private clear(notify: boolean): void {
    for (const key of [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]) this.storage.removeItem(key);
    this.signature = JSON.stringify([null, null, null]);
    this.snapshot = null;
    this.version++;
    if (notify) this.notify();
  }

  private notify(): void { for (const listener of this.listeners) listener(); }
}
