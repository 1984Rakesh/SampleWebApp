import { UnauthorizedError } from '../../errors';
import type { AuthResult } from '../../models/Auth';
import type { PasswordHasher } from '../../ports/PasswordHasher';
import type { TokenService } from '../../ports/TokenService';
import type { UserRepository } from '../../ports/UserRepository';

export interface LoginInput {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService
  ) {}

  async execute({ email, password }: LoginInput): Promise<AuthResult> {
    const credentials = await this.users.findCredentialsByEmail(email);
    const isValid =
      credentials !== null && (await this.passwordHasher.verify(password, credentials.passwordHash));

    if (!credentials || !isValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const { user } = credentials;
    const tokens = await this.tokenService.issueTokens({ userId: user.id, email: user.email });
    return { user, tokens };
  }
}
