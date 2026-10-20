import type { Profile } from '../../domain/models/Profile';
import type { UserProfileViewState } from './UserProfileViewState';

export function toUserProfileViewState(user: Profile): UserProfileViewState {
  return {
    name: user.name,
    email: user.email,
    bio: user.bio,
    avatarUrl: user.avatar,
    joinedLabel: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : undefined,
    initial: user.name.trim().charAt(0).toUpperCase() || 'U',
  };
}
