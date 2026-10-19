import { createTheme, type ThemeOptions } from '@mui/material/styles';

export type ThemeMode = 'light' | 'dark';

const displayFont = "'Bricolage Grotesque Variable', 'DM Sans', sans-serif";
const bodyFont = "'DM Sans', system-ui, sans-serif";

export const chipColors = {
  neutral: { fg: '#B5BDCC', bg: '#1E2430' },
  info: { fg: '#A9B7FF', bg: 'rgba(140,158,255,0.16)' },
  success: { fg: '#8FE3A8', bg: 'rgba(111,214,140,0.14)' },
  warning: { fg: '#F6C177', bg: 'rgba(244,184,96,0.14)' },
  danger: { fg: '#FF9E8C', bg: 'rgba(255,143,122,0.14)' },
} as const;

const commonOptions: ThemeOptions = {
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: bodyFont,
    h1: { fontFamily: displayFont, fontWeight: 700, fontSize: '2.625rem', letterSpacing: '-0.02em', lineHeight: 1.1 },
    h2: { fontFamily: displayFont, fontWeight: 600, fontSize: '1.375rem', letterSpacing: '-0.01em' },
    h3: { fontFamily: displayFont, fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.02em' },
    h4: { fontFamily: displayFont, fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontFamily: displayFont, fontWeight: 600 },
    h6: { fontFamily: displayFont, fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: { styleOverrides: { body: { minWidth: 320 } } },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'default' },
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiCard: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: { root: { borderRadius: 20, boxShadow: 'none' } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 12, padding: '10px 20px' } },
    },
    MuiChip: { styleOverrides: { root: { height: 24, fontSize: 12, fontWeight: 500, borderRadius: 999 } } },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 12 } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 24, padding: 8 } } },
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 0, borderRadius: 12, padding: 4 },
        indicator: { display: 'none' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { minHeight: 34, borderRadius: 9, textTransform: 'none', fontWeight: 500 },
      },
    },
    MuiTableCell: {
      styleOverrides: { head: { fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' } },
    },
  },
};

export function createAppTheme(mode: ThemeMode) {
  const dark = mode === 'dark';
  return createTheme({
    ...commonOptions,
    palette: {
      mode,
      primary: { main: dark ? '#8C9EFF' : '#5266D8', contrastText: dark ? '#0A0D13' : '#FFFFFF' },
      secondary: { main: dark ? '#A9B7FF' : '#6577D8' },
      error: { main: dark ? '#FF9E8C' : '#C64132' },
      warning: { main: dark ? '#F6C177' : '#A96300' },
      success: { main: dark ? '#8FE3A8' : '#238A45' },
      info: { main: dark ? '#A9B7FF' : '#5266D8' },
      background: { default: dark ? '#0A0D13' : '#F5F7FC', paper: dark ? '#11151D' : '#FFFFFF' },
      text: { primary: dark ? '#ECEFF5' : '#171B24', secondary: dark ? '#98A2B5' : '#5B6474' },
      divider: dark ? '#1E2430' : '#DDE2EC',
      action: { selected: dark ? '#1A2030' : '#E8ECFA', hover: dark ? '#171D28' : '#F0F3FA' },
    },
    components: {
      ...commonOptions.components,
      MuiCssBaseline: { styleOverrides: { body: { minWidth: 320, backgroundColor: dark ? '#0A0D13' : '#F5F7FC' } } },
      MuiAppBar: { styleOverrides: { root: { backgroundColor: dark ? '#0D1118' : '#FFFFFF', borderBottom: `1px solid ${dark ? '#1B212C' : '#DDE2EC'}` } } },
      MuiCard: { defaultProps: { variant: 'outlined' }, styleOverrides: { root: { backgroundColor: dark ? '#11151D' : '#FFFFFF', borderColor: dark ? '#1E2430' : '#DDE2EC', borderRadius: 20 } } },
      MuiOutlinedInput: { styleOverrides: { root: { backgroundColor: dark ? '#0D1118' : '#FFFFFF', borderRadius: 12, '& .MuiOutlinedInput-notchedOutline': { borderColor: dark ? '#2A3242' : '#C8D0DF' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: dark ? '#8C9EFF' : '#5266D8', borderWidth: 1.5 } } } },
      MuiDialog: { styleOverrides: { paper: { backgroundColor: dark ? '#11151D' : '#FFFFFF', border: `1px solid ${dark ? '#2A3242' : '#DDE2EC'}`, borderRadius: 24, padding: 8 } } },
      MuiTabs: { styleOverrides: { root: { minHeight: 0, backgroundColor: dark ? '#11151D' : '#FFFFFF', border: `1px solid ${dark ? '#232A37' : '#DDE2EC'}`, borderRadius: 12, padding: 4 }, indicator: { display: 'none' } } },
      MuiTab: { styleOverrides: { root: { minHeight: 34, borderRadius: 9, textTransform: 'none', fontWeight: 500, color: dark ? '#98A2B5' : '#5B6474', '&.Mui-selected': { backgroundColor: dark ? '#232B3B' : '#E8ECFA', color: dark ? '#ECEFF5' : '#171B24' } } } },
      MuiTableCell: { styleOverrides: { root: { borderBottom: `1px solid ${dark ? '#1B212C' : '#E4E8F0'}` }, head: { fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: dark ? '#98A2B5' : '#5B6474' } } },
    },
  });
}
