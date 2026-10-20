import { profileSchema } from '../dtos/schemas';
import type { ProfileDTO, UpdateProfileDTO } from '../dtos/ProfileDTO';
import { ProfileModel, type UpdateProfileInput } from '../../domain/models/Profile';
import { translateError } from '../../../shared/data/translateError';

export function toDomain(dto: ProfileDTO): ProfileModel {
  try {
    const value = profileSchema.parse(dto);
    return new ProfileModel(value.id, value.name, value.email, value.avatar, value.bio, value.createdAt);
  } catch (error) { throw translateError(error); }
}

export function toUpdateProfileDTO(input: UpdateProfileInput): UpdateProfileDTO {
  return { name: input.name, bio: input.bio, avatar: input.avatar };
}
