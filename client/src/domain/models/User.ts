export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
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
      this.name.length > 0 &&
      this.email.length > 0 &&
      this.isValidEmail()
    );
  }

  private isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }
}
