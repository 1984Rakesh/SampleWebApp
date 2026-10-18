import { userSchema } from './schemas';
import type { User } from '../../domain/models';
import { UserModel } from '../../domain/models';

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  created_at?: string;
}

export function toDomain(dto: UserDTO): User {
  const validated = userSchema.parse(dto);
  return new UserModel(
    validated.id,
    validated.name,
    validated.email,
    validated.avatar,
    validated.bio,
    validated.createdAt
  );
}

export function toDTO(domain: Partial<User>): Partial<UserDTO> {
  return {
    name: domain.name,
    bio: domain.bio,
    avatar: domain.avatar,
  };
}
