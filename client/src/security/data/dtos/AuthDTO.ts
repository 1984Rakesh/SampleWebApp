export interface AccountDTO {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
  createdAt?: string;
}

export interface LoginRequestDTO { email: string; password: string; }
export interface RegisterRequestDTO extends LoginRequestDTO { name: string; }
export interface AuthResponseDTO { user: AccountDTO; accessToken: string; refreshToken: string; }
export interface RefreshTokenResponseDTO { accessToken: string; }
