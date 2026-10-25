import { UnauthorizedError } from '../../../shared/domain/errors';
import { normalizeEmail, type AuthResult, type LoginInput } from '../models';
import type { PasswordHasher, TokenService, AccountRepository } from '../ports';

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
