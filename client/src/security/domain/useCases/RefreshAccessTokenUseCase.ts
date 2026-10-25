import type { AuthRepository, SessionRepository } from '../repositories';
import { UnauthorizedError } from '../../../shared/domain';

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
