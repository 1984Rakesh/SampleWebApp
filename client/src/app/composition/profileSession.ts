import { AccountModel, type Account, type SessionRepository } from '../../security';
import { ProfileModel, type Profile, type ProfileSession } from '../../profile';

export function accountToProfile(account: Account): Profile {
  return new ProfileModel(account.id, account.name, account.email, account.avatar, account.bio, account.createdAt);
}
export function profileToAccount(profile: Profile): Account {
  return new AccountModel(profile.id, profile.name, profile.email, profile.avatar, profile.bio, profile.createdAt);
}

/** Adapts the security session to the profile feature's consumer-owned session port. */
export function toProfileSession(sessions: SessionRepository): ProfileSession {
  return {
    getProfile: () => {
      const session = sessions.getSession();
      return session ? accountToProfile(session.user) : null;
    },
    getVersion: sessions.getVersion,
    updateProfile: (profile) => sessions.updateAccount(profileToAccount(profile)),
  };
}
