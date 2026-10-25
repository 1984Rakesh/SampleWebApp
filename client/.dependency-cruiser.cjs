/**
 * Client architecture boundaries. Every rule is error-level and enforces a rule from
 * client/.devin/rules/client-architecture.md (client §n) or
 * .devin/rules/clean-architecture.md (shared §n). Never weaken a rule to pass.
 */

const ROOTS = '(?:app|foundation|shared|components|assets)';
// Features are the top-level src folders that are not App, foundation, shared, components or assets.
const FEATURE_NAME = `(?!${ROOTS}/)[^/]+`;
const FEATURE = `^src/${FEATURE_NAME}/`;
const APP = '^src/(?:app/|App\\.tsx$)';
// shared §7: <feature>/<layer>/<sub>/, or <root>/<sub>/ for app, foundation, shared and components.
const MODULE_FOLDER = `src/(?:(?:app|foundation|shared|components)/[^/]+|${FEATURE_NAME}/[^/]+/[^/]+)/`;
const MODULE_FILE = `^${MODULE_FOLDER}`;
const MODULE_BARREL = `^${MODULE_FOLDER}index\\.tsx?$`;
const UI_VENDOR =
  '(?:^|/)node_modules/(?:radix-ui|@radix-ui/[^/]+|lucide-react|class-variance-authority|clsx|tailwind-merge|sonner)/';
const SHADCN_PRIMITIVE = '^src/components/ui/[a-z][^/]*\\.tsx$';
const CN_HELPER = '^src/components/ui/utils\\.ts$';
const BARREL_COMMENT =
  'shared §7 / client §6.2: imports from outside a module folder must go through its index.ts barrel.';

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'shared §1 Dependency Rule: dependencies point one way, so no import cycles.',
      from: {},
      to: { circular: true },
    },
    {
      name: 'not-to-unresolvable',
      severity: 'error',
      comment: 'client §7 Verification: every executable import must resolve to a real module.',
      from: {},
      to: { couldNotResolve: true },
    },
    {
      name: 'no-orphans',
      severity: 'error',
      comment: 'shared §7 No Orphans / client §6.3: only src/main.tsx and *.d.ts may be unimported.',
      from: { orphan: true, pathNot: ['^src/main\\.tsx$', '\\.d\\.ts$'] },
      to: {},
    },
    {
      name: 'no-orphans',
      severity: 'error',
      comment:
        'shared §7 No Orphans / client §6.3: every source file must be reachable from the entry src/main.tsx (except *.d.ts); catches files that import others but are never imported.',
      from: { path: '^src/main\\.tsx$' },
      to: { path: '^src/', pathNot: '\\.d\\.ts$', reachable: false },
    },
    {
      name: 'no-non-package-json',
      severity: 'error',
      comment: 'client §7 Verification: src may only use npm packages declared in package.json dependencies.',
      from: { path: '^src/' },
      to: { dependencyTypes: ['npm-no-pkg', 'npm-unknown'] },
    },
    {
      name: 'not-to-dev-dep',
      severity: 'error',
      comment: 'client §7 Verification: src must not depend on devDependencies (they are absent at runtime).',
      from: { path: '^src/' },
      to: { dependencyTypes: ['npm-dev'], dependencyTypesNot: ['type-only'], pathNot: ['node_modules/@types/'] },
    },
    {
      name: 'no-src-lib',
      severity: 'error',
      comment: 'client §1, §4.8: no src/lib/; cn lives in components/ui/utils.ts and display copy in the owning feature.',
      from: {},
      to: { path: '^src/lib/' },
    },
    {
      name: 'domain-only-own-domain-and-shared-domain',
      severity: 'error',
      comment:
        'shared §1 Domain Independence / client §1, §2.1: a feature domain imports only its own domain and shared/domain; no npm packages or Node core.',
      from: { path: `^src/(${FEATURE_NAME})/domain/` },
      to: { pathNot: ['^src/$1/domain/', '^src/shared/domain/'] },
    },
    {
      name: 'domain-repositories-not-to-use-cases',
      severity: 'error',
      comment: 'shared §1 One-Way Dependencies Within Domain / client §2.1: repositories import models only, never use cases.',
      from: { path: '^src/[^/]+/domain/repositories/' },
      to: { path: '^src/[^/]+/domain/useCases/' },
    },
    {
      name: 'feature-not-to-app',
      severity: 'error',
      comment: 'shared §1 App Owns Composition / client §1: features never import App.',
      from: { path: FEATURE },
      to: { path: APP },
    },
    {
      name: 'feature-not-to-sibling-feature',
      severity: 'error',
      comment:
        'shared §1 App Owns Composition / client §5.4: features never import sibling features; App injects consumer-owned contracts.',
      from: { path: `^src/(${FEATURE_NAME})/` },
      to: { path: FEATURE, pathNot: '^src/$1/' },
    },
    {
      name: 'presentation-not-to-data',
      severity: 'error',
      comment: 'shared §1 Presentation → Domain ← Data / client §1 table: presentation never imports data implementations.',
      from: { path: '^src/[^/]+/presentation/' },
      to: { path: '^src/[^/]+/data/' },
    },
    {
      name: 'data-not-to-presentation',
      severity: 'error',
      comment: 'shared §1 Presentation → Domain ← Data / client §1 table: data never imports presentation.',
      from: { path: '^src/[^/]+/data/' },
      to: { path: '^src/[^/]+/presentation/' },
    },
    {
      name: 'presentation-not-to-transport-libs',
      severity: 'error',
      comment:
        'client §1 table, §3.3: presentation never imports Axios, Zod or React Query; data repositories own them.',
      from: { path: '^src/[^/]+/presentation/' },
      to: { path: '(?:^|/)node_modules/(?:axios|zod|@tanstack/react-query)/' },
    },
    {
      name: 'screens-components-not-to-domain',
      severity: 'error',
      comment:
        'shared §2 No Leaky Abstractions / client §4.1: screens and feature components render ViewState, never domain entities/enums.',
      from: { path: '^src/[^/]+/presentation/(?:screens|components)/' },
      to: { path: '^src/[^/]+/domain/' },
    },
    {
      name: 'ui-vendor-only-in-components-ui-app',
      severity: 'error',
      comment:
        'shared §2 No Leaky Abstractions / client §4.7: radix-ui, lucide-react, cva, clsx, tailwind-merge, sonner and shadcn primitives only in components/ui and components/app.',
      from: { pathNot: '^src/components/(?:ui|app)/' },
      to: { path: [UI_VENDOR, SHADCN_PRIMITIVE] },
    },
    {
      name: 'cn-only-in-components-ui-app',
      severity: 'error',
      comment:
        'shared §2 No Leaky Abstractions / client §4.7, §4.8: the cn class helper (components/ui/utils.ts) is private to components/ui and components/app.',
      from: { pathNot: '^src/components/(?:ui|app)/' },
      to: { path: CN_HELPER },
    },
    {
      name: 'shared-modules-not-to-features-or-app',
      severity: 'error',
      comment:
        'shared §1 Pure, Narrow Shared Kernel / client §1: components, foundation and shared never import features or App.',
      from: { path: '^src/(?:components|foundation|shared)/' },
      to: { path: [FEATURE, APP] },
    },
    {
      name: 'foundation-not-to-shared-data',
      severity: 'error',
      comment: 'client §1: foundation exposes generic capabilities only; shared/data error translation is not foundation input.',
      from: { path: '^src/foundation/' },
      to: { path: '^src/shared/data/' },
    },
    {
      name: 'shared-domain-only-shared-domain',
      severity: 'error',
      comment: 'shared §1 Pure, Narrow Shared Kernel / client §1: shared/domain is framework-free and imports nothing outside itself.',
      from: { path: '^src/shared/domain/' },
      to: { pathNot: '^src/shared/domain/' },
    },
    {
      name: 'barrel-only-cross-module-imports',
      severity: 'error',
      comment: BARREL_COMMENT,
      from: { path: '^src/(app|foundation|shared|components)/([^/]+)/', pathNot: '^src/components/app/' },
      to: { path: MODULE_FILE, pathNot: [MODULE_BARREL, '^src/$1/$2/'] },
    },
    {
      name: 'barrel-only-cross-module-imports',
      severity: 'error',
      comment: `${BARREL_COMMENT} Exception: components/app may import the private cn helper and raw shadcn primitives from components/ui directly.`,
      from: { path: '^src/components/app/' },
      to: { path: MODULE_FILE, pathNot: [MODULE_BARREL, '^src/components/app/', CN_HELPER, SHADCN_PRIMITIVE] },
    },
    {
      name: 'barrel-only-cross-module-imports',
      severity: 'error',
      comment: BARREL_COMMENT,
      from: { path: `^src/(${FEATURE_NAME})/([^/]+)/([^/]+)/` },
      to: { path: MODULE_FILE, pathNot: [MODULE_BARREL, '^src/$1/$2/$3/'] },
    },
    {
      name: 'barrel-only-cross-module-imports',
      severity: 'error',
      comment: BARREL_COMMENT,
      from: { path: '^src/', pathNot: MODULE_FILE },
      to: { path: MODULE_FILE, pathNot: MODULE_BARREL },
    },
  ],
  options: {
    doNotFollow: { path: ['node_modules'] },
    parser: 'tsc',
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.app.json' },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default', 'types'],
      mainFields: ['module', 'main', 'types', 'typings'],
    },
    reporterOptions: {
      text: { highlightFocused: true },
    },
  },
};
