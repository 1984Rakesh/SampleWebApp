import type { AuthResult } from '../../models/Auth';
import type { PasswordHasher } from '../../ports/PasswordHasher';
import type { TokenService } from '../../ports/TokenService';
import type { UserRepository } from '../../ports/UserRepository';

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export class RegisterUserUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService
  ) {}

  async execute({ name, email, password }: RegisterUserInput): Promise<AuthResult> {
    const passwordHash = await this.passwordHasher.hash(password);
    const user = await this.users.create({ name, email, passwordHash });
    const tokens = await this.tokenService.issueTokens({ userId: user.id, email: user.email });
    return { user, tokens };
  }
}
