import type { Profile } from '../../domain/models';
import type { ProfileRepository, ProfileSession } from '../../domain/repositories';
import { UnauthorizedError } from '../../../shared/domain';

/** Keeps profile reads/updates in step with the session; stale results never revive or overwrite a newer session (client §5.3). */
export function bindProfileSession(source: ProfileRepository, session: ProfileSession): ProfileRepository {
  let issuedMutation = 0;
  let committedMutation = 0;
  async function sync(operation: () => Promise<Profile>, revision: number, mutation: boolean): Promise<Profile> {
    const current = session.getProfile();
    const version = session.getVersion();
    if (!current) throw new UnauthorizedError('Session has ended');
    const profile = await operation();
    const active = session.getProfile();
    if (session.getVersion() !== version || active?.id !== current.id || profile.id !== current.id) {
      throw new UnauthorizedError('Session has ended');
    }
    if (mutation ? revision < committedMutation : revision !== committedMutation) return active;
    if (mutation) committedMutation = revision;
    session.updateProfile(profile);
    return profile;
  }
  return {
    getCurrentUser: () => sync(source.getCurrentUser, committedMutation, false),
    updateProfile: (input) => sync(() => source.updateProfile(input), ++issuedMutation, true),
  };
}
