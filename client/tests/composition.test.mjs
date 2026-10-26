import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createElement, isValidElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createServer } from 'vite';

let vite;
let Navbar;
let NavbarToolbar;
let NavbarDrawer;
let authContext;
let authUseCases;
let profileUseCases;
let useCases;
let guards;
let AuthProvider;
let FeatureUseCasesProvider;
let AppNavbar;
let ColorModeContext;

before(async () => {
  vite = await createServer({
    server: { middlewareMode: true, watch: null, hmr: false },
    appType: 'custom',
  });
  Navbar = (await vite.ssrLoadModule('/src/components/layout/Navbar.tsx')).default;
  NavbarToolbar = (await vite.ssrLoadModule('/src/components/layout/navbar/NavbarToolbar.tsx')).default;
  NavbarDrawer = (await vite.ssrLoadModule('/src/components/layout/navbar/NavbarDrawer.tsx')).default;
  authContext = await vite.ssrLoadModule('/src/security/presentation/context/AuthSessionContext.ts');
  authUseCases = await vite.ssrLoadModule('/src/security/presentation/context/AuthUseCasesContext.ts');
  profileUseCases = await vite.ssrLoadModule('/src/profile/presentation/context/ProfileUseCasesContext.ts');
  useCases = await vite.ssrLoadModule('/src/tasks/presentation/context/TaskUseCasesContext.ts');
  guards = await vite.ssrLoadModule('/src/app/router/routeGuards.tsx');
  ({ AuthProvider } = await vite.ssrLoadModule('/src/app/providers/AuthProvider.tsx'));
  ({ FeatureUseCasesProvider } = await vite.ssrLoadModule('/src/app/providers/FeatureUseCasesProvider.tsx'));
  AppNavbar = (await vite.ssrLoadModule('/src/app/composition/AppNavbar.tsx')).default;
  ({ ColorModeContext } = await vite.ssrLoadModule('/src/foundation/theme/useColorMode.ts'));
});

after(async () => { await vite?.close(); });

const view = {
  userName: 'Test User', initial: 'T', mode: 'light',
  links: [{ to: '/dashboard', label: 'Dashboard' }, { to: '/tasks', label: 'Tasks' }],
  brand: { label: 'Clean Architecture', mark: 'T', to: '/dashboard' },
  profilePath: '/profile',
};

function navbarProps(overrides = {}) {
  return {
    view, drawerOpen: false,
    onOpenNavigation() {}, onCloseNavigation() {}, onToggleTheme() {}, onLogout() {}, onCreateTask() {},
    ...overrides,
  };
}

function descendants(element) {
  if (!isValidElement(element)) return [];
  const children = [element.props.children].flat(Infinity);
  return [element, ...children.flatMap(descendants)];
}

function memory(element) {
  return createElement(MemoryRouter, { initialEntries: ['/tasks'] }, element);
}

function sessionState(overrides = {}) {
  return {
    user: null, isLoading: false, isAuthenticated: false,
    setSession() {}, updateUser() {}, signOut() {},
    ...overrides,
  };
}

function withSession(element, state) {
  return createElement(authContext.AuthSessionContext.Provider, { value: state }, memory(element));
}

function storage(t, initial = {}) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const values = new Map(Object.entries(initial));
  const store = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: store });
  t.after(() => {
    if (previous) Object.defineProperty(globalThis, 'localStorage', previous);
    else delete globalThis.localStorage;
  });
  return store;
}

test('shared navbar renders supplied links, user and theme without feature or App providers', () => {
  const html = renderToStaticMarkup(memory(createElement(Navbar, navbarProps())));
  for (const text of ['Test User', 'Clean Architecture', 'href="/tasks"', 'href="/profile"', 'aria-current="page"', 'aria-label="New task"', 'aria-label="Log out"', 'aria-label="Toggle theme"']) {
    assert.ok(html.includes(text), `Missing navbar content: ${text}`);
  }
  for (const [mode, title] of [
    ['light', 'Switch to dark theme'],
    ['dark', 'Switch to light theme'],
  ]) {
    const themed = renderToStaticMarkup(memory(createElement(Navbar, navbarProps({ view: { ...view, mode } }))));
    assert.ok(themed.includes(`title="${title}"`), `Missing theme toggle title: ${title}`);
  }
});

test('controlled navbar forwards actions and mobile drawer state through narrow props', () => {
  const calls = [];
  const props = navbarProps({
    drawerOpen: true,
    onOpenNavigation: () => calls.push('open'),
    onCloseNavigation: () => calls.push('close'),
    onToggleTheme: () => calls.push('theme'),
    onLogout: () => calls.push('logout'),
    onCreateTask: () => calls.push('create'),
  });
  const entry = Navbar(props);
  assert.equal(entry.props.children[1].props.open, true);
  const toolbar = NavbarToolbar(entry.props.children[0].props);
  const rendered = toolbar.type(toolbar.props);
  const nodes = descendants(rendered);
  for (const label of ['Open navigation', 'Toggle theme', 'Log out', 'New task']) {
    const action = nodes.find((item) => item.props['aria-label'] === label);
    assert.ok(action, `Missing ${label}`);
    action.props.onClick();
  }
  const drawer = NavbarDrawer(entry.props.children[1].props);
  assert.equal(drawer.props.open, true);
  drawer.props.onOpenChange(false);
  const links = descendants(drawer).filter((item) => typeof item.props.to === 'string');
  assert.deepEqual(links.map(({ props }) => ({ to: props.to, label: props.children })), view.links);
  links[0].props.onClick();
  assert.deepEqual(calls, ['open', 'theme', 'logout', 'create', 'close', 'close']);
});

test('presentation consumers fail clearly when App has not supplied dependencies', () => {
  for (const [hook, message] of [
    [authContext.useAuth, /within an AuthProvider/],
    [useCases.useTaskUseCases, /supplied by App/],
  ]) {
    function Probe() { hook(); return null; }
    assert.throws(() => renderToStaticMarkup(createElement(Probe)), message);
  }
});

test('App supplies actual use-case capabilities without consumer imports of App or data adapters', (t) => {
  storage(t);
  const queryClient = new QueryClient();
  t.after(() => queryClient.clear());
  function Probe() {
    assert.equal(typeof authUseCases.useAuthUseCases().login, 'function');
    assert.equal(typeof useCases.useTaskUseCases().createTask, 'function');
    assert.equal(typeof useCases.useTaskUseCases().useTasksQuery, 'function');
    assert.equal(typeof profileUseCases.useUserUseCases().updateProfile, 'function');
    assert.equal(authUseCases.useAuthUseCases().isLoggingIn, false);
    assert.equal(useCases.useTaskUseCases().isCreating, false);
    return createElement('span', null, 'injected');
  }
  const element = createElement(QueryClientProvider, { client: queryClient },
    createElement(AuthProvider, null, createElement(FeatureUseCasesProvider, null, createElement(Probe))));
  assert.ok(renderToStaticMarkup(element).includes('injected'));
});

test('App auth provider preserves stored-session hydration and signout clears storage and cache', (t) => {
  const store = storage(t, {
    accessToken: 'test-access', refreshToken: 'test-refresh',
    user: JSON.stringify({ id: 'user-1', name: 'Stored User', email: 'stored@example.test' }),
  });
  const queryClient = new QueryClient();
  queryClient.setQueryData(['tasks'], ['cached-task']);
  t.after(() => queryClient.clear());
  let state;
  function Probe() { state = authContext.useAuth(); return createElement('span', null, state.user?.name); }
  const html = renderToStaticMarkup(createElement(QueryClientProvider, { client: queryClient },
    createElement(AuthProvider, null, createElement(Probe))));
  assert.ok(html.includes('Stored User'));
  assert.equal(state.isAuthenticated, true);
  state.signOut();
  for (const key of ['accessToken', 'refreshToken', 'user']) assert.equal(store.getItem(key), null);
  assert.equal(queryClient.getQueryCache().getAll().length, 0);
});

test('App auth provider clears invalid persisted sessions', (t) => {
  const store = storage(t, { accessToken: 'test-access', refreshToken: 'test-refresh', user: '{invalid' });
  const queryClient = new QueryClient();
  t.after(() => queryClient.clear());
  function Probe() {
    const state = authContext.useAuth();
    assert.equal(state.isAuthenticated, false);
    assert.equal(state.user, null);
    return null;
  }
  renderToStaticMarkup(createElement(QueryClientProvider, { client: queryClient },
    createElement(AuthProvider, null, createElement(Probe))));
  for (const key of ['accessToken', 'refreshToken', 'user']) assert.equal(store.getItem(key), null);
});

test('App route guards retain loading, public and protected visibility behavior', () => {
  const child = createElement('span', null, 'route-content');
  const protectedRoute = createElement(guards.ProtectedRoute, null, child);
  const publicRoute = createElement(guards.PublicRoute, null, child);
  assert.ok(renderToStaticMarkup(withSession(protectedRoute, sessionState({ isLoading: true }))).includes('Loading...'));
  assert.equal(renderToStaticMarkup(withSession(protectedRoute, sessionState())).includes('route-content'), false);
  assert.ok(renderToStaticMarkup(withSession(protectedRoute, sessionState({ isAuthenticated: true }))).includes('route-content'));
  assert.ok(renderToStaticMarkup(withSession(publicRoute, sessionState())).includes('route-content'));
  assert.equal(renderToStaticMarkup(withSession(publicRoute, sessionState({ isAuthenticated: true }))).includes('route-content'), false);
});

test('App navbar reads session and theme directly without mounting an auth form ViewModel', () => {
  const theme = { mode: 'light', resolvedMode: 'light', toggleMode() {} };
  const element = createElement(ColorModeContext.Provider, { value: theme }, createElement(AppNavbar));
  assert.equal(renderToStaticMarkup(withSession(element, sessionState())), '');
  const html = renderToStaticMarkup(withSession(element, sessionState({ isAuthenticated: true, user: { name: 'Current Name' } })));
  for (const text of ['Current Name', 'Dashboard', 'Tasks', 'Profile', 'Comparison']) assert.ok(html.includes(text));
});
