import { UnauthorizedError } from '../../errors';
import type { TokenService } from '../../ports/TokenService';

export class RefreshAccessTokenUseCase {
  constructor(private readonly tokenService: TokenService) {}

  async execute(refreshToken: string): Promise<string> {
    const payload = await this.tokenService.verify(refreshToken).catch(() => {
      throw new UnauthorizedError('Invalid refresh token');
    });
    return this.tokenService.issueAccessToken(payload);
  }
}
