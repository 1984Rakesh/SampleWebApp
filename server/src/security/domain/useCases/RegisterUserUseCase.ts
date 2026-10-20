import type { AuthResult, RegisterUserInput } from '../models/Auth';
import { normalizeEmail, validatePassword } from '../models/Account';
import { normalizeUserName } from '../../../shared/domain/normalizeUserName';
import type { PasswordHasher } from '../ports/PasswordHasher';
import type { TokenService } from '../ports/TokenService';
import type { AccountRepository } from '../ports/AccountRepository';

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
