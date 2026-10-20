import type { AxiosInstance } from 'axios';
import type { ProfileDTO, UpdateProfileDTO } from '../dtos/ProfileDTO';
import { atDataBoundary } from '../../../shared/data/translateError';

export function createProfileApi(client: AxiosInstance) {
  return {
    getCurrentUser: () => atDataBoundary(async () => (await client.get<ProfileDTO>('/users/me')).data),
    updateProfile: (input: UpdateProfileDTO) => atDataBoundary(async () => (await client.put<ProfileDTO>('/users/me', input)).data),
  };
}
