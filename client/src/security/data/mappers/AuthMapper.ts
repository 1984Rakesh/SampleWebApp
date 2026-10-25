import { authResponseSchema, refreshTokenResponseSchema, type AuthResponseDTO, type LoginRequestDTO, type RegisterRequestDTO } from '../dtos';
import { AccountModel, type AuthSession, type LoginInput, type RegisterUserInput } from '../../domain/models';
import { translateError } from '../../../shared/data';

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
