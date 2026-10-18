import { createContext, useContext } from 'react';
import type { ThemeMode } from './theme';

interface ColorModeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
  setLightMode: () => void;
  setDarkMode: () => void;
}

export const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined);

export function useColorMode(): ColorModeContextType {
  const context = useContext(ColorModeContext);
  if (context === undefined) {
    throw new Error('useColorMode must be used within a ThemeProvider');
  }
  return context;
}
