const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
}

export interface UpdateProfileInput {
  name?: string;
  bio?: string;
  avatar?: string;
}

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export class UserModel implements User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public avatar?: string,
    public bio?: string,
    public createdAt?: string
  ) {}

  isValid(): boolean {
    return (
      this.id.length > 0 &&
      this.name.trim().length > 0 &&
      this.email.trim().length > 0 &&
      isValidEmail(this.email)
    );
  }
}
