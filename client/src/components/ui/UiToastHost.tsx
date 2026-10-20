import { Toaster } from './sonner';

// Single sealed notification host; App mounts this once under ThemeProvider.
export default function UiToastHost() {
  return <Toaster position="top-right" />;
}
