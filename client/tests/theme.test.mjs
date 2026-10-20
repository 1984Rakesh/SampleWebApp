import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { after, before, test } from 'node:test';
import vm from 'node:vm';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

let vite;
let ThemeProvider;
let ColorModeContext;

before(async () => {
  vite = await createServer({
    server: { middlewareMode: true, watch: null, hmr: false },
    appType: 'custom',
  });
  ({ ThemeProvider } = await vite.ssrLoadModule('/src/foundation/theme/ThemeProvider.tsx'));
  ({ ColorModeContext } = await vite.ssrLoadModule('/src/foundation/theme/useColorMode.ts'));
});

after(async () => { await vite?.close(); });

// Renders "mode:resolvedMode" read from ColorModeContext inside ThemeProvider.
// SSR runs the useState initializers (stored-preference resolution) but not
// effects, so persistence and <html> class sync are covered manually instead.
function renderPreference() {
  const probe = (value) => `${value.mode}:${value.resolvedMode}`;
  return renderToStaticMarkup(createElement(ThemeProvider, null, createElement('div', null, createElement(ColorModeContext.Consumer, null, probe))));
}

function assertPreference(t, options, expected) {
  browser(t, options);
  assert.ok(renderPreference().includes(`>${expected}<`));
}

function browser(t, { stored = {}, dark = false, failing = false } = {}) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const values = new Map(Object.entries(stored));
  const localStorage = failing
    ? {
        getItem: () => { throw new Error('denied'); },
        setItem: () => { throw new Error('denied'); },
        removeItem: () => { throw new Error('denied'); },
      }
    : {
        getItem: (key) => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, value),
        removeItem: (key) => values.delete(key),
      };
  const windowShim = {
    localStorage,
    matchMedia: (query) => ({
      matches: dark && query === '(prefers-color-scheme: dark)',
      media: query,
      addEventListener() {},
      removeEventListener() {},
    }),
  };
  Object.defineProperty(globalThis, 'window', { configurable: true, value: windowShim });
  t.after(() => {
    if (previous) Object.defineProperty(globalThis, 'window', previous);
    else delete globalThis.window;
  });
  return windowShim;
}

test('theme provider defaults to system and follows the OS preference', (t) => {
  assertPreference(t, { dark: false }, 'system:light');
});

test('theme provider resolves system to dark when the OS prefers dark', (t) => {
  assertPreference(t, { dark: true }, 'system:dark');
});

test('theme provider honours a valid stored color-mode', (t) => {
  assertPreference(t, { stored: { 'color-mode': 'dark' } }, 'dark:dark');
});

test('theme provider falls back to a valid legacy theme value', (t) => {
  assertPreference(t, { stored: { theme: 'dark' } }, 'dark:dark');
});

test('a valid color-mode wins over a conflicting legacy theme value', (t) => {
  assertPreference(t, { stored: { 'color-mode': 'light', theme: 'dark' } }, 'light:light');
});

test('invalid stored values fall back to system', (t) => {
  assertPreference(t, { stored: { 'color-mode': 'sepia', theme: 'sepia' }, dark: true }, 'system:dark');
});

test('theme provider defaults to system when storage is inaccessible', (t) => {
  assertPreference(t, { failing: true }, 'system:light');
});

// Executes the real inline bootstrap script from index.html in a Node vm with
// browser shims, so the tests exercise the shipped code rather than a copy of
// its algorithm.
const bootstrapSource = (() => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const match = html.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(match, 'index.html should contain an inline bootstrap script');
  return match[1];
})();

function runBootstrap({ stored = {}, dark = false, failing = false, matchMediaFails = false } = {}) {
  const values = new Map(Object.entries(stored));
  const localStorage = failing
    ? {
        getItem: () => { throw new Error('denied'); },
      }
    : {
        getItem: (key) => values.get(key) ?? null,
      };
  const root = {
    darkClass: false,
    classList: {
      toggle(name, force) {
        if (name === 'dark') root.darkClass = Boolean(force);
      },
    },
    style: {},
  };
  const sandbox = {
    localStorage,
    window: {
      matchMedia: (query) => {
        if (matchMediaFails) throw new Error('denied');
        return { matches: dark && query === '(prefers-color-scheme: dark)' };
      },
    },
    document: { documentElement: root },
  };
  vm.createContext(sandbox);
  vm.runInContext(bootstrapSource, sandbox);
  return root;
}

function assertBootstrap(options, { dark: expectedDark }) {
  const root = runBootstrap(options);
  assert.equal(root.darkClass, expectedDark);
  assert.equal(root.style.colorScheme, expectedDark ? 'dark' : 'light');
}

test('bootstrap script honours a valid stored color-mode', () => {
  assertBootstrap({ stored: { 'color-mode': 'dark' } }, { dark: true });
  assertBootstrap({ stored: { 'color-mode': 'light' }, dark: true }, { dark: false });
});

test('bootstrap script falls back to a valid legacy theme value', () => {
  assertBootstrap({ stored: { theme: 'dark' } }, { dark: true });
});

test('bootstrap script: a valid color-mode wins over a conflicting legacy value', () => {
  assertBootstrap({ stored: { 'color-mode': 'light', theme: 'dark' }, dark: true }, { dark: false });
});

test('bootstrap script: invalid stored values follow the OS preference', () => {
  assertBootstrap({ stored: { 'color-mode': 'sepia', theme: 'sepia' }, dark: true }, { dark: true });
});

test('bootstrap script defaults to the OS preference with no stored values', () => {
  assertBootstrap({ dark: true }, { dark: true });
  assertBootstrap({ dark: false }, { dark: false });
});

test('bootstrap script still applies a dark OS preference when storage is inaccessible', () => {
  assertBootstrap({ failing: true, dark: true }, { dark: true });
});

test('bootstrap script resolves light when storage is inaccessible and the OS prefers light', () => {
  assertBootstrap({ failing: true, dark: false }, { dark: false });
});

test('bootstrap script leaves light defaults when matchMedia is unavailable', () => {
  const root = runBootstrap({ dark: true, matchMediaFails: true });
  assert.equal(root.darkClass, false);
  assert.equal(root.style.colorScheme, undefined);
});
