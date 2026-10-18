import axiosClient from '../../foundation/network/axiosClient';
import type { AuthResponseDTO, RefreshTokenResponseDTO } from '../dtos';
import type { LoginInput, RegisterUserInput } from '../../domain/useCases';

export const authApi = {
  async register(input: RegisterUserInput): Promise<AuthResponseDTO> {
    const response = await axiosClient.post<AuthResponseDTO>('/auth/register', input);
    return response.data;
  },

  async login(input: LoginInput): Promise<AuthResponseDTO> {
    const response = await axiosClient.post<AuthResponseDTO>('/auth/login', input);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponseDTO> {
    const response = await axiosClient.post<RefreshTokenResponseDTO>('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },
};
