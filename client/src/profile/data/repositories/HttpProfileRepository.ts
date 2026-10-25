import type { createProfileApi } from '../api';
import type { ProfileRepository } from '../../domain/repositories';
import { profileToDomain, toUpdateProfileDTO } from '../mappers';

export function createProfileRepository(api: ReturnType<typeof createProfileApi>): ProfileRepository {
  return {
    getCurrentUser: async () => profileToDomain(await api.getCurrentUser()),
    updateProfile: async (input) => profileToDomain(await api.updateProfile(toUpdateProfileDTO(input))),
  };
}
