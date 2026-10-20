import type { createProfileApi } from '../api/ProfileApi';
import type { ProfileRepository } from '../../domain/repositories/ProfileRepository';
import { toDomain, toUpdateProfileDTO } from '../mappers/ProfileMapper';

export function createProfileRepository(api: ReturnType<typeof createProfileApi>): ProfileRepository {
  return {
    getCurrentUser: async () => toDomain(await api.getCurrentUser()),
    updateProfile: async (input) => toDomain(await api.updateProfile(toUpdateProfileDTO(input))),
  };
}
