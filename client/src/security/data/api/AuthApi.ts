import type { AxiosInstance } from 'axios';
import type { AuthResponseDTO, LoginRequestDTO, RegisterRequestDTO, RefreshTokenResponseDTO } from '../dtos';
import { atDataBoundary } from '../../../shared/data';

export function createAuthApi(client: AxiosInstance, refreshClient: AxiosInstance) {
  return {
    login: (input: LoginRequestDTO) => atDataBoundary(async () => (await client.post<AuthResponseDTO>('/auth/login', input)).data),
    register: (input: RegisterRequestDTO) => atDataBoundary(async () => (await client.post<AuthResponseDTO>('/auth/register', input)).data),
    refreshToken: (refreshToken: string) => atDataBoundary(async () => (await refreshClient.post<RefreshTokenResponseDTO>('/auth/refresh', { refreshToken })).data),
  };
}

export function isAuthenticationRequest(url?: string): boolean {
  if (!url) return false;
  const path = new URL(url, 'http://localhost').pathname.replace(/\/$/, '');
  return ['/auth/login', '/auth/register', '/auth/refresh'].some((endpoint) => path.endsWith(endpoint));
}
