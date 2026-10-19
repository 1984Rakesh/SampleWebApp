import '@fontsource-variable/bricolage-grotesque/index.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import { useMemo, useState, useEffect, useCallback, type ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createAppTheme, type ThemeMode } from './theme';
import { ColorModeContext, type ColorModePreference } from './useColorMode';

const STORAGE_KEY = 'theme';

function getOsPreference(): ThemeMode {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

function getInitialPreference(): ColorModePreference {
  const saved = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
  if (saved === 'light' || saved === 'dark' || saved === 'system') {
    return saved;
  }
  return 'system';
}

function resolveMode(pref: ColorModePreference): ThemeMode {
  return pref === 'system' ? getOsPreference() : pref;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [preference, setPreference] = useState<ColorModePreference>(getInitialPreference);
  const [osMode, setOsMode] = useState<ThemeMode>(getOsPreference);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, preference);
  }, [preference]);

  // Listen for OS theme changes when in system mode
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (event: MediaQueryListEvent) => setOsMode(event.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const resolved: ThemeMode = preference === 'system' ? osMode : preference;

  const toggleMode = useCallback(() => {
    setPreference((prev) => {
      if (prev === 'system') return resolveMode('system') === 'dark' ? 'light' : 'dark';
      return prev === 'light' ? 'dark' : 'light';
    });
  }, []);

  const setLightMode = useCallback(() => setPreference('light'), []);
  const setDarkMode = useCallback(() => setPreference('dark'), []);
  const setSystemMode = useCallback(() => setPreference('system'), []);

  const theme = useMemo(() => createAppTheme(resolved), [resolved]);

  return (
    <ColorModeContext.Provider value={{ mode: preference, resolvedMode: resolved, toggleMode, setLightMode, setDarkMode, setSystemMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}
