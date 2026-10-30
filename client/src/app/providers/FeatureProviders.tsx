import type { ReactNode } from 'react';
import { dashboard, profile, security, tasks } from '../composition';

/** Mounts each feature's own provider; dashboard and profile read tasks/profile through App adapters. */
export function FeatureProviders({ children }: { children: ReactNode }) {
  return (
    <security.Provider>
      <tasks.Provider>
        <profile.Provider>
          <dashboard.Provider>{children}</dashboard.Provider>
        </profile.Provider>
      </tasks.Provider>
    </security.Provider>
  );
}
