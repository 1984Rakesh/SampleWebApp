import type { AuthResult } from '../../domain/models/Auth';
import type { AuthResponse } from '../schemas/AuthDto';

export function authResultToResponse({ account, tokens }: AuthResult): AuthResponse {
  return {
    user: {
      id: account.id,
      name: account.name,
      email: account.email,
      avatar: account.avatar,
      bio: account.bio,
      createdAt: account.createdAt,
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}
