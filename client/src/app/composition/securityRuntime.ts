import axiosClient, { configureAuthentication, createHttpClient } from '../../foundation/network/axiosClient';
import { browserStorage } from '../../foundation/session/storage';
import { BrowserSessionRepository } from '../../security/data/repositories/BrowserSessionRepository';
import { createAuthApi, isAuthenticationRequest } from '../../security/data/api/AuthApi';
import { createAuthRepository } from '../../security/data/repositories/HttpAuthRepository';
import { refreshAccessTokenUseCase } from '../../security/domain/useCases/RefreshAccessTokenUseCase';
import { signOutUseCase } from '../../security/domain/useCases/SignOutUseCase';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
axiosClient.defaults.baseURL = baseURL;
const refreshClient = createHttpClient({ baseURL }).client;
export const sessions = new BrowserSessionRepository(browserStorage);
export const authRepository = createAuthRepository(createAuthApi(axiosClient, refreshClient));

configureAuthentication({
  getAccessToken: () => sessions.getSession()?.accessToken ?? null,
  getVersion: sessions.getVersion,
  refreshAccessToken: () => refreshAccessTokenUseCase(authRepository, sessions),
  onSessionExpired: () => signOutUseCase(sessions),
  isPublicRequest: isAuthenticationRequest,
});
