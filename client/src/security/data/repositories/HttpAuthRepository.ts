import type { createAuthApi } from '../api';
import type { AuthRepository } from '../../domain/repositories';
import { authToDomain, refreshToDomain, toLoginRequestDTO, toRegisterRequestDTO } from '../mappers';

export function createAuthRepository(api: ReturnType<typeof createAuthApi>): AuthRepository {
  return {
    login: async (input) => authToDomain(await api.login(toLoginRequestDTO(input))),
    register: async (input) => authToDomain(await api.register(toRegisterRequestDTO(input))),
    refreshToken: async (token) => refreshToDomain(await api.refreshToken(token)),
  };
}
