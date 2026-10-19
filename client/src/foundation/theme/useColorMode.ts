import { createContext, useContext } from 'react';

export type ColorModePreference = 'light' | 'dark' | 'system';

interface ColorModeContextType {
  /** The user's stored preference: 'light', 'dark', or 'system'. */
  mode: ColorModePreference;
  /** The resolved appearance: always 'light' or 'dark'. */
  resolvedMode: 'light' | 'dark';
  toggleMode: () => void;
  setLightMode: () => void;
  setDarkMode: () => void;
  setSystemMode: () => void;
}

export const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined);

export function useColorMode(): ColorModeContextType {
  const context = useContext(ColorModeContext);
  if (context === undefined) {
    throw new Error('useColorMode must be used within a ThemeProvider');
  }
  return context;
}
