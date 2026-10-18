import { UnauthorizedError } from '../../errors';
import type { TokenService } from '../../ports/TokenService';
import type { UserRepository } from '../../ports/UserRepository';

export class RefreshAccessTokenUseCase {
  constructor(
    private readonly tokenService: TokenService,
    private readonly users: UserRepository
  ) {}

  async execute(refreshToken: string): Promise<string> {
    const payload = await this.tokenService.verifyRefreshToken(refreshToken);
    const user = await this.users.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedError('Invalid refresh token');
    }
    return this.tokenService.issueAccessToken({ userId: user.id, email: user.email });
  }
}
