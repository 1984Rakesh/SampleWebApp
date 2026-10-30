import { createContext, useContext } from 'react';
import type { DashboardExternalRouting } from '../contracts';

export const DashboardRoutingContext = createContext<DashboardExternalRouting | undefined>(undefined);

export function useDashboardRouting(): DashboardExternalRouting {
  const value = useContext(DashboardRoutingContext);
  if (!value) throw new Error('Dashboard routing must be supplied by App');
  return value;
}
