import type { AuthTokens, TokenPayload } from '../models/Auth';

export interface TokenService {
  issueTokens(payload: TokenPayload): Promise<AuthTokens>;
  issueAccessToken(payload: TokenPayload): Promise<string>;
  verifyAccessToken(token: string): Promise<TokenPayload>;
  verifyRefreshToken(token: string): Promise<TokenPayload>;
}
