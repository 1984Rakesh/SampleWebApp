import type { ReactNode } from 'react';
import { FeatureUseCasesContext } from '../../presentation/context/FeatureUseCasesContext';
import { AuthUseCasesContext } from '../../security/presentation/context/AuthUseCasesContext';
import { ProfileUseCasesContext } from '../../profile/presentation/context/ProfileUseCasesContext';
import { TaskUseCasesContext } from '../../tasks/presentation/context/TaskUseCasesContext';
import { useAuth } from '../../security/presentation/context/AuthSessionContext';
import { useAuthUseCases, useTaskUseCases, useUserUseCases } from '../composition';

export function FeatureUseCasesProvider({ children }: { children: ReactNode }) {
  const auth = useAuthUseCases();
  const tasks = useTaskUseCases();
  const profile = useUserUseCases();
  const { user } = useAuth();
  function useProfileSummary() {
    const query = profile.useCurrentUserQuery();
    return { name: query.data?.name || user?.name || 'User', isLoading: query.isLoading };
  }
  return (
    <AuthUseCasesContext.Provider value={auth}>
      <ProfileUseCasesContext.Provider value={profile}>
        <TaskUseCasesContext.Provider value={tasks}>
          <FeatureUseCasesContext.Provider value={{ useProfileSummary }}>{children}</FeatureUseCasesContext.Provider>
        </TaskUseCasesContext.Provider>
      </ProfileUseCasesContext.Provider>
    </AuthUseCasesContext.Provider>
  );
}
