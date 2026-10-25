import type { Profile } from '../../domain/models';
import type { ProfileResponse } from '../schemas';

export function profileToResponse(profile: Profile): ProfileResponse {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    avatar: profile.avatar,
    bio: profile.bio,
    createdAt: profile.createdAt,
  };
}
