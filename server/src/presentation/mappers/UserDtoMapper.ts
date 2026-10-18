import type { AuthResult } from '../../domain/models/Auth';
import type { User } from '../../domain/models/User';
import type { AuthResponse } from '../schemas/AuthDto';
import type { UserResponse } from '../schemas/UserDto';

export function userToResponse(user: User): UserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    createdAt: user.createdAt,
  };
}

export function authResultToResponse({ user, tokens }: AuthResult): AuthResponse {
  return {
    user: userToResponse(user),
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}
