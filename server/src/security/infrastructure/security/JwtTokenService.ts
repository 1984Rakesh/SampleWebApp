import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../../shared/domain';
import type { AuthTokens, TokenPayload } from '../../domain/models';
import type { TokenService } from '../../domain/ports';

export interface JwtTokenServiceConfig {
  secret: string;
  accessExpiresIn: string;
  refreshExpiresIn: string;
}

type TokenType = 'access' | 'refresh';

export class JwtTokenService implements TokenService {
  constructor(private readonly config: JwtTokenServiceConfig) {}

  async issueTokens(payload: TokenPayload): Promise<AuthTokens> {
    return {
      accessToken: this.sign(payload, 'access', this.config.accessExpiresIn),
      refreshToken: this.sign(payload, 'refresh', this.config.refreshExpiresIn),
    };
  }

  async issueAccessToken(payload: TokenPayload): Promise<string> {
    return this.sign(payload, 'access', this.config.accessExpiresIn);
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    return this.verifyByType(token, 'access');
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    return this.verifyByType(token, 'refresh');
  }

  private verifyByType(token: string, expectedType: TokenType): TokenPayload {
    let decoded: string | jwt.JwtPayload;
    try {
      decoded = jwt.verify(token, this.config.secret);
    } catch {
      throw new UnauthorizedError('Invalid or expired token');
    }

    if (
      typeof decoded !== 'object' ||
      typeof decoded.userId !== 'string' ||
      typeof decoded.email !== 'string' ||
      decoded.type !== expectedType
    ) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    return { userId: decoded.userId, email: decoded.email };
  }

  private sign({ userId, email }: TokenPayload, type: TokenType, expiresIn: string): string {
    return jwt.sign({ userId, email, type }, this.config.secret, {
      expiresIn,
    } as jwt.SignOptions);
  }
}
