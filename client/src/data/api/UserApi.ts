import axiosClient from '../../foundation/network/axiosClient';
import type { UserDTO, UpdateUserDTO } from '../dtos';

export const userApi = {
  async getCurrentUser(): Promise<UserDTO> {
    const response = await axiosClient.get<UserDTO>('/users/me');
    return response.data;
  },

  async updateProfile(input: UpdateUserDTO): Promise<UserDTO> {
    const response = await axiosClient.put<UserDTO>('/users/me', input);
    return response.data;
  },
};
