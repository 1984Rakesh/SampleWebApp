import type { Account } from '../../domain/models';

/** Outbound navigation the security feature needs; App links it to another feature's route (shared §9). */
export interface SecurityExternalRouting {
  homePath: string;
}

/** Session lifecycle hooks App uses to reset user-scoped caches outside this feature. */
export interface SecuritySessionListener {
  clearUserData(): void;
  sessionStarted(account: Account): void;
}
