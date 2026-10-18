import type { UserDTO } from './UserDTO';

export interface AuthResponseDTO {
  user: UserDTO;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponseDTO {
  accessToken: string;
}
