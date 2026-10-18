import { authResponseSchema } from '../dtos';
import type { AuthResponseDTO, LoginRequestDTO, RegisterRequestDTO } from '../dtos';
import type { AuthSession, LoginInput, RegisterUserInput } from '../../domain/models';
import { toDomain as userToDomain } from './UserMapper';

export function toDomain(dto: AuthResponseDTO): AuthSession {
  const validated = authResponseSchema.parse(dto);
  return {
    user: userToDomain(validated.user),
    accessToken: validated.accessToken,
    refreshToken: validated.refreshToken,
  };
}

export function toLoginRequestDTO(input: LoginInput): LoginRequestDTO {
  return {
    email: input.email,
    password: input.password,
  };
}

export function toRegisterRequestDTO(input: RegisterUserInput): RegisterRequestDTO {
  return {
    name: input.name,
    email: input.email,
    password: input.password,
  };
}
