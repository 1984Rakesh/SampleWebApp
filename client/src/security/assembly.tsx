import { lazy, useCallback, useSyncExternalStore, type ReactNode } from 'react';
import type { AxiosInstance } from 'axios';
import type { KeyValueStorage } from '../foundation/session';
import { createAuthApi, isAuthenticationRequest } from './data/api';
import { BrowserSessionRepository, createAuthRepository, useAuthRepository } from './data/repositories';
import type { AuthSession } from './domain/models';
import { loginUseCase, refreshAccessTokenUseCase, registerUserUseCase, signOutUseCase } from './domain/useCases';
import { AuthSessionContext, AuthUseCasesContext, SecurityRoutingContext, useAuth, type AuthUseCases } from './presentation/context';
import {
  SecurityRoute,
  type SecurityExternalRouting,
  type SecurityFeature,
  type SecuritySessionListener,
} from './presentation/contracts';

export interface SecurityFeatureDependencies {
  http: AxiosInstance;
  /** Non-intercepted transport for token refresh (client §5.2). */
  refreshHttp: AxiosInstance;
  storage: KeyValueStorage;
  /** Must return a stable object while its own dependencies are unchanged. */
  useSessionListener(): SecuritySessionListener;
  routing: SecurityExternalRouting;
}

/** Builds the security feature's internals from App-supplied cross-feature dependencies (shared §10). */
export function createSecurityFeature(deps: SecurityFeatureDependencies): SecurityFeature {
  const LoginScreen = lazy(() => import('./presentation/screens').then((m) => ({ default: m.LoginScreen })));
  const RegisterScreen = lazy(() => import('./presentation/screens').then((m) => ({ default: m.RegisterScreen })));

  const sessions = new BrowserSessionRepository(deps.storage);
  const authRepository = createAuthRepository(createAuthApi(deps.http, deps.refreshHttp));

  function useAuthUseCases(): AuthUseCases {
    const { repository, isLoggingIn, isRegistering } = useAuthRepository(authRepository);
    return {
      login: (input) => loginUseCase(repository, input),
      register: (input) => registerUserUseCase(repository, input),
      isLoggingIn, isRegistering,
    };
  }

  function SecurityProvider({ children }: { children: ReactNode }) {
    const listener = deps.useSessionListener();
    const subscribe = useCallback((notify: () => void) => sessions.subscribe(() => {
      if (!sessions.getSession()) listener.clearUserData();
      notify();
    }), [listener]);
    const session = useSyncExternalStore(subscribe, sessions.getSession, sessions.getSession);
    const setSession = (next: AuthSession) => {
      listener.clearUserData();
      sessions.saveSession(next);
      listener.sessionStarted(next.user);
    };
    const signOut = () => { signOutUseCase(sessions); listener.clearUserData(); };
    const authUseCases = useAuthUseCases();
    return (
      <AuthSessionContext.Provider value={{ user: session?.user ?? null, isLoading: false, isAuthenticated: !!session, setSession, signOut }}>
        <AuthUseCasesContext.Provider value={authUseCases}>
          <SecurityRoutingContext.Provider value={deps.routing}>{children}</SecurityRoutingContext.Provider>
        </AuthUseCasesContext.Provider>
      </AuthSessionContext.Provider>
    );
  }

  return {
    routes: [
      { path: SecurityRoute.login, element: <LoginScreen /> },
      { path: SecurityRoute.register, element: <RegisterScreen /> },
    ],
    Provider: SecurityProvider,
    useSession: useAuth,
    sessions,
    authentication: {
      getAccessToken: () => sessions.getSession()?.accessToken ?? null,
      getVersion: sessions.getVersion,
      refreshAccessToken: () => refreshAccessTokenUseCase(authRepository, sessions),
      onSessionExpired: () => signOutUseCase(sessions),
      isPublicRequest: isAuthenticationRequest,
    },
  };
}
