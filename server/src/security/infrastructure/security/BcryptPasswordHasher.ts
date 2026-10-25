import bcrypt from 'bcrypt';
import type { PasswordHasher } from '../../domain/ports';

export class BcryptPasswordHasher implements PasswordHasher {
  constructor(private readonly saltRounds = 10) {}

  hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
