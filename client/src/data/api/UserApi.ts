import axiosClient from '../../foundation/network/axiosClient';
import type { User } from '../../domain/models';

export interface UpdateUserInput {
  name?: string;
  bio?: string;
  avatar?: string;
}

export const userApi = {
  async getCurrentUser(): Promise<User> {
    const response = await axiosClient.get<User>('/users/me');
    return response.data;
  },

  async updateProfile(input: UpdateUserInput): Promise<User> {
    const response = await axiosClient.put<User>('/users/me', input);
    return response.data;
  },
};
