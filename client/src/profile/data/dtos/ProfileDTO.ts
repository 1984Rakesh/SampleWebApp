export interface ProfileDTO {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
  createdAt?: string;
}

export interface UpdateProfileDTO {
  name?: string;
  bio?: string | null;
  avatar?: string | null;
}
