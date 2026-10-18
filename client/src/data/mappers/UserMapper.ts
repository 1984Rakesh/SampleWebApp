import { userSchema } from '../dtos';
import type { UserDTO, UpdateUserDTO } from '../dtos';
import type { User } from '../../domain/models';
import { UserModel } from '../../domain/models';
import type { UpdateProfileInput } from '../../domain/useCases';

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

export function toUpdateUserDTO(input: UpdateProfileInput): UpdateUserDTO {
  return {
    name: input.name,
    bio: input.bio,
    avatar: input.avatar,
  };
}
