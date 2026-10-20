import type { AuthRepository } from '../repositories/AuthRepository';
import type { SessionRepository } from '../repositories/SessionRepository';
import { UnauthorizedError } from '../../../shared/domain/errors';

export async function refreshAccessTokenUseCase(auth: AuthRepository, sessions: SessionRepository): Promise<string> {
  const session = sessions.getSession();
  const version = sessions.getVersion();
  if (!session?.refreshToken) throw new UnauthorizedError('Session has ended');
  const token = await auth.refreshToken(session.refreshToken);
  if (sessions.getVersion() !== version || sessions.getSession()?.refreshToken !== session.refreshToken) {
    throw new UnauthorizedError('Session has ended');
  }
  sessions.saveAccessToken(token);
  return token;
}
