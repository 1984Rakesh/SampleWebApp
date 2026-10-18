import { authResponseSchema } from '../dtos';
import type { AuthResponseDTO } from '../dtos';
import type { AuthSession } from '../../domain/models';
import { toDomain as userToDomain } from './UserMapper';

export function toDomain(dto: AuthResponseDTO): AuthSession {
  const validated = authResponseSchema.parse(dto);
  return {
    user: userToDomain(validated.user),
    accessToken: validated.accessToken,
    refreshToken: validated.refreshToken,
  };
}
