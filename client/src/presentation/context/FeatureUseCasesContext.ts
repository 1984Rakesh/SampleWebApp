import { createContext, useContext } from 'react';

export interface FeatureUseCases {
  useProfileSummary(): { name: string; isLoading: boolean };
}
export const FeatureUseCasesContext = createContext<FeatureUseCases | undefined>(undefined);
function useFeatureUseCases(): FeatureUseCases {
  const value = useContext(FeatureUseCasesContext);
  if (!value) throw new Error('Feature use cases must be supplied by App');
  return value;
}
export function useDashboardProfile() { return useFeatureUseCases().useProfileSummary(); }
