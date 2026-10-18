import { userSchema } from './schemas';
import type { User } from '../../domain/models';
import { UserModel } from '../../domain/models';

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
  createdAt?: string;
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

export function toDTO(domain: Partial<User>): Pick<Partial<User>, 'name' | 'bio' | 'avatar'> {
  return {
    name: domain.name,
    bio: domain.bio,
    avatar: domain.avatar,
  };
}
