export interface UserDTO {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
  createdAt?: string;
}

export interface UpdateUserDTO {
  name?: string;
  bio?: string;
  avatar?: string;
}
