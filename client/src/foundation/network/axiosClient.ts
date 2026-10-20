import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';

export class HttpError extends Error {
  constructor(message: string, public readonly status?: number) { super(message); this.name = 'HttpError'; }
}

export function toHttpError(error: unknown): Error {
  if (!axios.isAxiosError(error)) return error instanceof Error ? error : new HttpError('Request failed');
  const message = error.response?.data?.error;
  return new HttpError(typeof message === 'string' ? message : error.message, error.response?.status);
}

export interface AuthenticationCapabilities {
  getAccessToken(): string | null;
  getVersion(): number;
  refreshAccessToken(): Promise<string>;
  onSessionExpired(): void;
  isPublicRequest(url?: string): boolean;
}

type RetryRequest = InternalAxiosRequestConfig & { _retry?: boolean; _sessionVersion?: number };

export function createHttpClient(config: AxiosRequestConfig = {}) {
  let authentication: AuthenticationCapabilities | undefined;
  let pending: { version: number; promise: Promise<string> } | undefined;

  // Create axios instance
  const client = axios.create({ timeout: 10000, ...config, headers: { 'Content-Type': 'application/json', ...config.headers } });

  // Request interceptor to add JWT token
  client.interceptors.request.use((request: RetryRequest) => {
    if (authentication) {
      const token = authentication.getAccessToken();
      const version = authentication.getVersion();
      if (request._sessionVersion !== undefined && request._sessionVersion !== version) throw new HttpError('Session has ended', 401);
      request._sessionVersion ??= version;
      if (token) request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  }, (error: unknown) => { throw toHttpError(error); }, { synchronous: true });

  // Response interceptor for token refresh and error translation
  client.interceptors.response.use((response) => response, async (error: unknown) => {
    const original = axios.isAxiosError(error) ? error.config as RetryRequest | undefined : undefined;
    const auth = authentication;
    // Handle 401 errors on protected routes (skip login/register/refresh endpoints)
    if (!axios.isAxiosError(error) || error.response?.status !== 401 || !original || !auth || auth.isPublicRequest(original.url)) {
      throw toHttpError(error);
    }
    const version = original._sessionVersion;
    if (version !== auth.getVersion()) throw toHttpError(error);
    if (original._retry) {
      auth.onSessionExpired();
      throw toHttpError(error);
    }
    original._retry = true;
    try {
      // Attempt to refresh token
      if (!pending || pending.version !== version) pending = { version, promise: auth.refreshAccessToken() };
      const flight = pending;
      let token: string;
      try { token = await flight.promise; }
      finally { if (pending === flight) pending = undefined; }
      if (version !== auth.getVersion()) throw new HttpError('Session has ended', 401);
      // Retry original request with new token
      original.headers.Authorization = `Bearer ${token}`;
      return await client(original);
    } catch (refreshError) {
      if (version === auth.getVersion()) auth.onSessionExpired();
      throw toHttpError(refreshError);
    }
  });

  return {
    client,
    configureAuthentication: (capabilities: AuthenticationCapabilities) => { authentication = capabilities; },
  };
}

const transport = createHttpClient();
export const configureAuthentication = transport.configureAuthentication;
export default transport.client;
