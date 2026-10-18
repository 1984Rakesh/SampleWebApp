import axiosClient from '../../foundation/network/axiosClient';
import type { RegisterUserInput, RegisterUserOutput } from '../../domain/useCases';
import type { LoginInput, LoginOutput } from '../../domain/useCases';

export const authApi = {
  async register(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const response = await axiosClient.post<RegisterUserOutput>('/auth/register', input);
    return response.data;
  },

  async login(input: LoginInput): Promise<LoginOutput> {
    const response = await axiosClient.post<LoginOutput>('/auth/login', input);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await axiosClient.post<{ accessToken: string }>('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },
};
