import type { SessionRepository } from '../repositories/SessionRepository';

export function signOutUseCase(sessions: SessionRepository): void {
  sessions.clearSession();
}
