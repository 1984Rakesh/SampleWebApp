import { createContext, useContext } from 'react';
import type { SecurityExternalRouting } from '../contracts';

export const SecurityRoutingContext = createContext<SecurityExternalRouting | undefined>(undefined);
export function useSecurityRouting(): SecurityExternalRouting {
  const value = useContext(SecurityRoutingContext);
  if (!value) throw new Error('Security routing must be supplied by the security assembly');
  return value;
}
