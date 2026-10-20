import type { ReactNode } from 'react';
import { AuthUseCasesContext } from '../../security/presentation/context/AuthUseCasesContext';
import { ProfileUseCasesContext } from '../../profile/presentation/context/ProfileUseCasesContext';
import { TaskUseCasesContext } from '../../tasks/presentation/context/TaskUseCasesContext';
import { DashboardCapabilitiesContext } from '../../dashboard/presentation/context/DashboardCapabilitiesContext';
import { useAuthUseCases, useDashboardCapabilities, useTaskUseCases, useUserUseCases } from '../composition';

export function FeatureUseCasesProvider({ children }: { children: ReactNode }) {
  const auth = useAuthUseCases();
  const tasks = useTaskUseCases();
  const profile = useUserUseCases();
  const dashboard = useDashboardCapabilities();
  return (
    <AuthUseCasesContext.Provider value={auth}>
      <ProfileUseCasesContext.Provider value={profile}>
        <TaskUseCasesContext.Provider value={tasks}>
          <DashboardCapabilitiesContext.Provider value={dashboard}>{children}</DashboardCapabilitiesContext.Provider>
        </TaskUseCasesContext.Provider>
      </ProfileUseCasesContext.Provider>
    </AuthUseCasesContext.Provider>
  );
}
