import type { User } from '../models';
import type { UpdateProfileInput } from '../useCases/UpdateProfileUseCase';

export interface UserRepository {
  updateProfile(input: UpdateProfileInput): Promise<User>;
}
