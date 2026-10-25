import { isValidEmail } from '../../../shared/domain';

export interface Account {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
}

export class AccountModel implements Account {
  constructor(
    public id: string, public name: string, public email: string,
    public avatar?: string, public bio?: string, public createdAt?: string
  ) {}

  isValid(): boolean {
    return this.id.length > 0 && this.name.trim().length > 0 && isValidEmail(this.email);
  }
}
