import axiosClient from '../../foundation/network/axiosClient';
import type {
  AuthResponseDTO,
  LoginRequestDTO,
  RefreshTokenResponseDTO,
  RegisterRequestDTO,
} from '../dtos';

export const authApi = {
  async register(input: RegisterRequestDTO): Promise<AuthResponseDTO> {
    const response = await axiosClient.post<AuthResponseDTO>('/auth/register', input);
    return response.data;
  },

  async login(input: LoginRequestDTO): Promise<AuthResponseDTO> {
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
