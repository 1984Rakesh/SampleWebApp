import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../domain/errors';
import type { AuthTokens, TokenPayload } from '../../domain/models/Auth';
import type { TokenService } from '../../domain/ports/TokenService';

export interface JwtTokenServiceConfig {
  secret: string;
  accessExpiresIn: string;
  refreshExpiresIn: string;
}

export class JwtTokenService implements TokenService {
  constructor(private readonly config: JwtTokenServiceConfig) {}

  async issueTokens(payload: TokenPayload): Promise<AuthTokens> {
    return {
      accessToken: this.sign(payload, this.config.accessExpiresIn),
      refreshToken: this.sign(payload, this.config.refreshExpiresIn),
    };
  }

  async issueAccessToken(payload: TokenPayload): Promise<string> {
    return this.sign(payload, this.config.accessExpiresIn);
  }

  async verify(token: string): Promise<TokenPayload> {
    let decoded: string | jwt.JwtPayload;
    try {
      decoded = jwt.verify(token, this.config.secret);
    } catch {
      throw new UnauthorizedError('Invalid or expired token');
    }

    if (
      typeof decoded !== 'object' ||
      typeof decoded.userId !== 'string' ||
      typeof decoded.email !== 'string'
    ) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    return { userId: decoded.userId, email: decoded.email };
  }

  private sign({ userId, email }: TokenPayload, expiresIn: string): string {
    return jwt.sign({ userId, email }, this.config.secret, {
      expiresIn,
    } as jwt.SignOptions);
  }
}
