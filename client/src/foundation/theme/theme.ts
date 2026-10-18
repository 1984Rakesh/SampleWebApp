import { createTheme, type ThemeOptions } from '@mui/material/styles';

export type ThemeMode = 'light' | 'dark';

const commonOptions: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '0.6rem 1.25rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
};

export function createAppTheme(mode: ThemeMode) {
  return createTheme({
    ...commonOptions,
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#2563eb' : '#60a5fa',
        contrastText: '#ffffff',
      },
      secondary: {
        main: mode === 'light' ? '#7c3aed' : '#a78bfa',
      },
      error: {
        main: mode === 'light' ? '#dc2626' : '#f87171',
      },
      warning: {
        main: mode === 'light' ? '#ea580c' : '#fb923c',
      },
      info: {
        main: mode === 'light' ? '#0284c7' : '#38bdf8',
      },
      success: {
        main: mode === 'light' ? '#16a34a' : '#4ade80',
      },
      background: {
        default: mode === 'light' ? '#f8fafc' : '#0f172a',
        paper: mode === 'light' ? '#ffffff' : '#1e293b',
      },
      text: {
        primary: mode === 'light' ? '#1e293b' : '#f1f5f9',
        secondary: mode === 'light' ? '#64748b' : '#94a3b8',
      },
    },
  });
}
