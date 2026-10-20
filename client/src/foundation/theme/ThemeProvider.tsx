import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { ColorModeContext, type ColorModePreference, type ThemeMode } from './useColorMode';

const STORAGE_KEY = 'color-mode';
const LEGACY_STORAGE_KEY = 'theme';

function getOsPreference(): ThemeMode {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

function isValidPreference(value: string | null): value is ColorModePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

function readStoredPreference(key: string): ColorModePreference | null {
  try {
    const saved = window.localStorage.getItem(key);
    return isValidPreference(saved) ? saved : null;
  } catch {
    return null;
  }
}

function getInitialPreference(): ColorModePreference {
  if (typeof window === 'undefined') {
    return 'system';
  }
  return readStoredPreference(STORAGE_KEY) ?? readStoredPreference(LEGACY_STORAGE_KEY) ?? 'system';
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
    try {
      window.localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // Storage may be unavailable; the preference still applies for this session.
    }
  }, [preference]);

  // Listen for OS theme changes when in system mode
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (event: MediaQueryListEvent) => setOsMode(event.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const resolved: ThemeMode = preference === 'system' ? osMode : preference;

  // Keep <html> in sync with the resolved mode so token CSS and native
  // widgets track it; index.html applies the same value before first paint.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', resolved === 'dark');
    root.style.colorScheme = resolved;
  }, [resolved]);

  const toggleMode = useCallback(() => {
    setPreference((prev) => {
      if (prev === 'system') return resolveMode('system') === 'dark' ? 'light' : 'dark';
      return prev === 'light' ? 'dark' : 'light';
    });
  }, []);

  const setLightMode = useCallback(() => setPreference('light'), []);
  const setDarkMode = useCallback(() => setPreference('dark'), []);
  const setSystemMode = useCallback(() => setPreference('system'), []);

  return (
    <ColorModeContext.Provider value={{ mode: preference, resolvedMode: resolved, toggleMode, setLightMode, setDarkMode, setSystemMode }}>
      {children}
    </ColorModeContext.Provider>
  );
}
