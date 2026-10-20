import { useCallback, useSyncExternalStore, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { AuthSession } from '../../security/domain/models/AuthSession';
import { signOutUseCase } from '../../security/domain/useCases/SignOutUseCase';
import { AuthSessionContext } from '../../security/presentation/context/AuthSessionContext';
import { cacheProfile } from '../../profile/data/repositories/ReactQueryProfileRepository';
import { sessions } from '../composition/securityRuntime';
import { accountToProfile } from '../composition/profileSession';

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const subscribe = useCallback((listener: () => void) => sessions.subscribe(() => {
    if (!sessions.getSession()) queryClient.clear();
    listener();
  }), [queryClient]);
  const session = useSyncExternalStore(subscribe, sessions.getSession, sessions.getSession);
  const setSession = (next: AuthSession) => {
    queryClient.clear();
    sessions.saveSession(next);
    cacheProfile(queryClient, accountToProfile(next.user));
  };
  const signOut = () => { signOutUseCase(sessions); queryClient.clear(); };
  return (
    <AuthSessionContext.Provider value={{ user: session?.user ?? null, isLoading: false, isAuthenticated: !!session, setSession, signOut }}>
      {children}
    </AuthSessionContext.Provider>
  );
}
