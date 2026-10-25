import { isValidEmail } from '../../../shared/domain';

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
}

export interface UpdateProfileInput {
  name?: string;
  bio?: string | null;
  avatar?: string | null;
}

export class ProfileModel implements Profile {
  constructor(
    public id: string, public name: string, public email: string,
    public avatar?: string, public bio?: string, public createdAt?: string
  ) {}

  isValid(): boolean {
    return this.id.length > 0 && this.name.trim().length > 0 && isValidEmail(this.email);
  }
}
