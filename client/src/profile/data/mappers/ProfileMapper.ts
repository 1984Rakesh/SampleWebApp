import { profileSchema, type ProfileDTO, type UpdateProfileDTO } from '../dtos';
import { ProfileModel, type UpdateProfileInput } from '../../domain/models';
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
