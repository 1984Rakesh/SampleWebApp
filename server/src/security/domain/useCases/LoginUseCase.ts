import { UnauthorizedError } from '../../../shared/domain/errors';
import type { AuthResult, LoginInput } from '../models/Auth';
import { normalizeEmail } from '../models/Account';
import type { PasswordHasher } from '../ports/PasswordHasher';
import type { TokenService } from '../ports/TokenService';
import type { AccountRepository } from '../ports/AccountRepository';

export class LoginUseCase {
  constructor(
    private readonly accounts: AccountRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService
  ) {}

  async execute({ email, password }: LoginInput): Promise<AuthResult> {
    const normalizedEmail = normalizeEmail(email);
    const credentials = await this.accounts.findCredentialsByEmail(normalizedEmail);
    const isValid =
      credentials !== null && (await this.passwordHasher.verify(password, credentials.passwordHash));
    if (!credentials || !isValid) throw new UnauthorizedError('Invalid credentials');
    const { account } = credentials;
    const tokens = await this.tokenService.issueTokens({ userId: account.id, email: account.email });
    return { account, tokens };
  }
}
