import { AccountModel, type Account } from '../../security/domain/models';
import type { SessionRepository } from '../../security/domain/repositories';
import { ProfileModel, type Profile } from '../../profile/domain/models';
import type { ProfileRepository } from '../../profile/domain/repositories';
import { UnauthorizedError } from '../../shared/domain/errors';

export function accountToProfile(account: Account): Profile {
  return new ProfileModel(account.id, account.name, account.email, account.avatar, account.bio, account.createdAt);
}
export function profileToAccount(profile: Profile): Account {
  return new AccountModel(profile.id, profile.name, profile.email, profile.avatar, profile.bio, profile.createdAt);
}

export function bindProfileSession(source: ProfileRepository, sessions: SessionRepository): ProfileRepository {
  let issuedMutation = 0;
  let committedMutation = 0;
  async function sync(operation: () => Promise<Profile>, revision: number, mutation: boolean): Promise<Profile> {
    const current = sessions.getSession();
    const version = sessions.getVersion();
    if (!current) throw new UnauthorizedError('Session has ended');
    const profile = await operation();
    const active = sessions.getSession();
    if (sessions.getVersion() !== version || active?.user.id !== current.user.id || profile.id !== current.user.id) {
      throw new UnauthorizedError('Session has ended');
    }
    if (mutation ? revision < committedMutation : revision !== committedMutation) return accountToProfile(active.user);
    if (mutation) committedMutation = revision;
    sessions.updateAccount(profileToAccount(profile));
    return profile;
  }
  return {
    getCurrentUser: () => sync(source.getCurrentUser, committedMutation, false),
    updateProfile: (input) => sync(() => source.updateProfile(input), ++issuedMutation, true),
  };
}
