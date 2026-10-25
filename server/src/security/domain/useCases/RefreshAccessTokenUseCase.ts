import { UnauthorizedError } from '../../../shared/domain/errors';
import type { TokenService, AccountRepository } from '../ports';

export class RefreshAccessTokenUseCase {
  constructor(
    private readonly tokenService: TokenService,
    private readonly accounts: Pick<AccountRepository, 'findIdentityById'>
  ) {}

  async execute(refreshToken: string): Promise<string> {
    const payload = await this.tokenService.verifyRefreshToken(refreshToken);
    const identity = await this.accounts.findIdentityById(payload.userId);
    if (!identity) throw new UnauthorizedError('Invalid refresh token');
    return this.tokenService.issueAccessToken({ userId: identity.id, email: identity.email });
  }
}
