import type { ComponentType, ReactNode } from 'react';
import type { RouteObject } from 'react-router-dom';
import type { SessionRepository } from '../../domain/repositories';
import type { AuthSessionState } from './AuthSessionState';

/** Token access App injects into generic networking (client §5.1). */
export interface SessionAuthentication {
  getAccessToken(): string | null;
  getVersion(): number;
  refreshAccessToken(): Promise<string>;
  onSessionExpired(): void;
  isPublicRequest(url?: string): boolean;
}

/** What the security assembly hands to App (shared §10). */
export interface SecurityFeature {
  routes: RouteObject[];
  Provider: ComponentType<{ children: ReactNode }>;
  useSession(): AuthSessionState;
  sessions: SessionRepository;
  authentication: SessionAuthentication;
}
