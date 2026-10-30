import { lazy, type ReactNode } from 'react';
import { DashboardCapabilitiesContext, DashboardRoutingContext } from './presentation/context';
import {
  DashboardRoute,
  type DashboardCapabilities,
  type DashboardExternalRouting,
  type DashboardFeature,
} from './presentation/contracts';

export interface DashboardFeatureDependencies {
  useCapabilities(): DashboardCapabilities;
  routing: DashboardExternalRouting;
}

/** Builds the dashboard feature's internals from App-supplied cross-feature dependencies (shared §10). */
export function createDashboardFeature(deps: DashboardFeatureDependencies): DashboardFeature {
  const DashboardScreen = lazy(() => import('./presentation/screens').then((m) => ({ default: m.DashboardScreen })));

  function DashboardProvider({ children }: { children: ReactNode }) {
    return (
      <DashboardCapabilitiesContext.Provider value={deps.useCapabilities()}>
        <DashboardRoutingContext.Provider value={deps.routing}>{children}</DashboardRoutingContext.Provider>
      </DashboardCapabilitiesContext.Provider>
    );
  }

  return {
    routes: [
      { path: '/', element: <DashboardScreen /> },
      { path: DashboardRoute.home, element: <DashboardScreen /> },
    ],
    Provider: DashboardProvider,
  };
}
