import axiosClient, { configureAuthentication, createHttpClient } from '../../foundation/network/axiosClient';
import { browserStorage } from '../../foundation/session/storage';
import { BrowserSessionRepository, createAuthRepository } from '../../security/data/repositories';
import { createAuthApi, isAuthenticationRequest } from '../../security/data/api';
import { refreshAccessTokenUseCase, signOutUseCase } from '../../security/domain/useCases';

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
