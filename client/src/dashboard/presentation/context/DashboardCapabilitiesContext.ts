import { createContext, useContext } from 'react';
import type { DashboardCapabilities } from '../contracts';

export type { DashboardCapabilities };
export const DashboardCapabilitiesContext = createContext<DashboardCapabilities | undefined>(undefined);

export function useDashboardCapabilities(): DashboardCapabilities {
  const value = useContext(DashboardCapabilitiesContext);
  if (!value) throw new Error('Dashboard capabilities must be supplied by App');
  return value;
}
