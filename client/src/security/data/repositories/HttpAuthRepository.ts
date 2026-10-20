import type { createAuthApi } from '../api/AuthApi';
import type { AuthRepository } from '../../domain/repositories/AuthRepository';
import { toDomain, refreshToDomain, toLoginRequestDTO, toRegisterRequestDTO } from '../mappers/AuthMapper';

export function createAuthRepository(api: ReturnType<typeof createAuthApi>): AuthRepository {
  return {
    login: async (input) => toDomain(await api.login(toLoginRequestDTO(input))),
    register: async (input) => toDomain(await api.register(toRegisterRequestDTO(input))),
    refreshToken: async (token) => refreshToDomain(await api.refreshToken(token)),
  };
}
