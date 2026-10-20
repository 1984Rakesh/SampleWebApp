import { authResponseSchema, refreshTokenResponseSchema } from '../dtos/schemas';
import type { AuthResponseDTO, LoginRequestDTO, RegisterRequestDTO } from '../dtos/AuthDTO';
import type { AuthSession, LoginInput, RegisterUserInput } from '../../domain/models/AuthSession';
import { AccountModel } from '../../domain/models/Account';
import { translateError } from '../../../shared/data/translateError';

export function toDomain(dto: AuthResponseDTO): AuthSession {
  try {
    const validated = authResponseSchema.parse(dto);
    const user = validated.user;
    return {
      user: new AccountModel(user.id, user.name, user.email, user.avatar, user.bio, user.createdAt),
      accessToken: validated.accessToken, refreshToken: validated.refreshToken,
    };
  } catch (error) { throw translateError(error); }
}

export function refreshToDomain(dto: unknown): string {
  try { return refreshTokenResponseSchema.parse(dto).accessToken; }
  catch (error) { throw translateError(error); }
}

export function toLoginRequestDTO(input: LoginInput): LoginRequestDTO {
  return { email: input.email, password: input.password };
}
export function toRegisterRequestDTO(input: RegisterUserInput): RegisterRequestDTO {
  return { name: input.name, email: input.email, password: input.password };
}
