import { normalizeEmail, validatePassword, type AuthResult, type RegisterUserInput } from '../models';
import { normalizeUserName } from '../../../shared/domain';
import type { PasswordHasher, TokenService, AccountRepository } from '../ports';

export class RegisterUserUseCase {
  constructor(
    private readonly accounts: AccountRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService
  ) {}

  async execute({ name, email, password }: RegisterUserInput): Promise<AuthResult> {
    const normalizedName = normalizeUserName(name);
    const normalizedEmail = normalizeEmail(email);
    const validPassword = validatePassword(password);
    const passwordHash = await this.passwordHasher.hash(validPassword);
    const account = await this.accounts.create({ name: normalizedName, email: normalizedEmail, passwordHash });
    const tokens = await this.tokenService.issueTokens({ userId: account.id, email: account.email });
    return { account, tokens };
  }
}
