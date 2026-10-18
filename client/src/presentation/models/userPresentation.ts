import type { User } from '../../domain/models';
import type { UserProfileViewState } from './UserProfileViewState';

export function toUserProfileViewState(user: User): UserProfileViewState {
  return {
    name: user.name,
    email: user.email,
    bio: user.bio,
    avatarUrl: user.avatar,
    joinedLabel: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : undefined,
  };
}
