import type { SessionRepository } from '../repositories';

export function signOutUseCase(sessions: SessionRepository): void {
  sessions.clearSession();
}
