/**
 * Server architecture boundaries. Every rule is error-level and enforces a rule from
 * .agents/skills/server-architecture/SKILL.md (server §n) or
 * .agents/skills/clean-architecture/SKILL.md (shared §n). Never weaken a rule to pass.
 *
 * TypeScript 7 has no JS compiler API, so sources are parsed with swc (@swc/core).
 */

const ROOTS = '(?:app|foundation|shared)';
// Features are the top-level src folders that are not App, foundation or shared.
const FEATURE_NAME = `(?!${ROOTS}/)[^/]+`;
const FEATURE = `^src/${FEATURE_NAME}/`;
const FEATURE_BARREL = `^src/${FEATURE_NAME}/index\\.ts$`;
const APP = '^src/(?:app/|server\\.ts$)';
// server §5.1: <feature>/<layer>/<sub>/, or <root>/<sub>/ for app, foundation and shared.
const MODULE_FOLDER = `src/(?:${ROOTS}/[^/]+|${FEATURE_NAME}/[^/]+/[^/]+)/`;
const MODULE_FILE = `^${MODULE_FOLDER}`;
const MODULE_BARREL = `^${MODULE_FOLDER}index\\.ts$`;
const npm = (packages) => `(?:^|/)node_modules/(?:@types/)?(?:${packages})/`;
const CLIENT = '^\\.\\./client/';
const BARREL_COMMENT =
  'shared §7 / server §5.2: imports from outside a module folder must go through its index.ts barrel.';

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
      comment: 'server §6 App and Verification: every executable import must resolve to a real module.',
      from: {},
      to: { couldNotResolve: true },
    },
    {
      name: 'no-orphans',
      severity: 'error',
      comment: 'shared §7 No Orphans / server §5.3: only src/server.ts, tests and *.d.ts may be unimported.',
      from: { orphan: true, pathNot: ['^src/server\\.ts$', '^tests/', CLIENT, '\\.d\\.ts$'] },
      to: {},
    },
    {
      name: 'no-orphans',
      severity: 'error',
      comment:
        'shared §7 No Orphans / server §5.3: every source file must be reachable from the entry src/server.ts (except *.d.ts); catches files that import others but are never imported.',
      from: { path: '^src/server\\.ts$' },
      to: { path: '^src/', pathNot: '\\.d\\.ts$', reachable: false },
    },
    {
      name: 'no-non-package-json',
      severity: 'error',
      comment: 'server §6 App and Verification: src may only use npm packages declared in package.json dependencies.',
      from: { path: '^src/' },
      to: { dependencyTypes: ['npm-no-pkg', 'npm-unknown'] },
    },
    {
      name: 'not-to-dev-dep',
      severity: 'error',
      comment: 'server §6 App and Verification: src must not depend on devDependencies (they are absent at runtime).',
      from: { path: '^src/' },
      to: { dependencyTypes: ['npm-dev'], dependencyTypesNot: ['type-only'], pathNot: ['node_modules/@types/'] },
    },
    {
      name: 'domain-only-own-domain-and-shared-domain',
      severity: 'error',
      comment:
        'shared §1 Domain Independence / server §1 table: a feature domain imports only its own domain and shared/domain; no npm packages or Node core.',
      from: { path: `^src/(${FEATURE_NAME})/domain/` },
      to: { pathNot: ['^src/$1/domain/', '^src/shared/domain/'] },
    },
    {
      name: 'domain-ports-not-to-use-cases',
      severity: 'error',
      comment: 'shared §1 One-Way Dependencies Within Domain / server §2.3: ports import models, never use cases.',
      from: { path: '^src/[^/]+/domain/ports/' },
      to: { path: '^src/[^/]+/domain/useCases/' },
    },
    {
      name: 'feature-not-to-app',
      severity: 'error',
      comment: 'shared §1 App Owns Cross-Feature Composition / server §1: features never import App.',
      from: { path: FEATURE },
      to: { path: APP },
    },
    {
      name: 'feature-not-to-sibling-feature',
      severity: 'error',
      comment:
        'shared §1 App Owns Cross-Feature Composition / server §1: features never import sibling features; App injects consumer-owned ports.',
      from: { path: `^src/(${FEATURE_NAME})/` },
      to: { path: FEATURE, pathNot: '^src/$1/' },
    },
    {
      name: 'app-only-to-feature-public-barrel',
      severity: 'error',
      comment:
        'shared §10 Only Contracts Are Public / server §6: App reaches a feature only through its public src/<feature>/index.ts.',
      from: { path: APP },
      to: { path: FEATURE, pathNot: FEATURE_BARREL },
    },
    {
      name: 'feature-barrel-only-contracts-and-assembly',
      severity: 'error',
      comment:
        'shared §10 Only Contracts Are Public / server §6: a feature barrel re-exports only its assembly and domain contracts (models, ports).',
      from: { path: `^src/(${FEATURE_NAME})/index\\.ts$` },
      to: { pathNot: ['^src/$1/assembly\\.ts$', '^src/$1/domain/(?:models|ports)/index\\.ts$'] },
    },
    {
      name: 'feature-assembly-only-from-feature-barrel',
      severity: 'error',
      comment:
        'shared §10 Feature Assembly / server §6: the assembly is published only through its feature barrel.',
      from: { pathNot: FEATURE_BARREL },
      to: { path: `${FEATURE}assembly\\.ts$` },
    },
    {
      name: 'feature-barrel-only-from-app',
      severity: 'error',
      comment:
        'shared §10 Feature Assembly / server §6: only App imports a feature barrel; feature internals never import their own barrel.',
      from: { pathNot: APP },
      to: { path: FEATURE_BARREL },
    },
    {
      name: 'feature-root-only-barrel-and-assembly',
      severity: 'error',
      comment:
        'shared §10 / server §5.1: a feature root holds only index.ts and assembly.ts; everything else lives in <feature>/<layer>/<sub>/.',
      from: { path: `${FEATURE}(?!(?:index|assembly)\\.ts$)[^/]+$` },
      to: {},
    },
    {
      name: 'feature-root-only-barrel-and-assembly',
      severity: 'error',
      comment:
        'shared §10 / server §5.1: a feature root holds only index.ts and assembly.ts; everything else lives in <feature>/<layer>/<sub>/.',
      from: {},
      to: { path: `${FEATURE}(?!(?:index|assembly)\\.ts$)[^/]+$` },
    },
    {
      name: 'presentation-not-to-infrastructure',
      severity: 'error',
      comment:
        'shared §1 Presentation → Domain ← Infrastructure / server §1 table: presentation never imports infrastructure.',
      from: { path: '^src/[^/]+/presentation/' },
      to: { path: '^src/[^/]+/infrastructure/' },
    },
    {
      name: 'infrastructure-not-to-presentation',
      severity: 'error',
      comment:
        'shared §1 Presentation → Domain ← Infrastructure / server §1 table: infrastructure never imports presentation.',
      from: { path: '^src/[^/]+/infrastructure/' },
      to: { path: '^src/[^/]+/presentation/' },
    },
    {
      name: 'express-zod-only-in-presentation-http-app',
      severity: 'error',
      comment:
        'server §1 table, §4, §3.7: Express and Zod only in feature presentation, foundation/http and App.',
      from: { path: '^src/', pathNot: [`${FEATURE}presentation/`, '^src/foundation/http/', APP] },
      to: { path: npm('express|express-serve-static-core|zod') },
    },
    {
      name: 'sqlite-only-in-infrastructure-database-app',
      severity: 'error',
      comment:
        'server §1 table, §3.1, §3.6: better-sqlite3 only in feature infrastructure, foundation/database and App.',
      from: { path: '^src/', pathNot: [`${FEATURE}infrastructure/`, '^src/foundation/database/', APP] },
      to: { path: npm('better-sqlite3') },
    },
    {
      name: 'crypto-libs-only-in-security-infrastructure',
      severity: 'error',
      comment: 'server §3.5: bcrypt and jsonwebtoken implementations belong only to security/infrastructure/security.',
      from: { path: '^src/', pathNot: '^src/security/infrastructure/security/' },
      to: { path: npm('bcrypt|jsonwebtoken') },
    },
    {
      name: 'dotenv-only-in-bootstrap-and-app',
      severity: 'error',
      comment: 'server §6: dotenv may be imported only by server.ts and app/.',
      from: { path: '^src/', pathNot: APP },
      to: { path: npm('dotenv') },
    },
    {
      name: 'foundation-not-to-features-or-app',
      severity: 'error',
      comment: 'shared §1 App Owns Cross-Feature Composition / server §1 table: foundation never imports features or App.',
      from: { path: '^src/foundation/' },
      to: { path: [FEATURE, APP] },
    },
    {
      name: 'shared-domain-only-shared-domain',
      severity: 'error',
      comment:
        'shared §1 Pure, Narrow Shared Kernel / server §1 table: shared/domain is framework-free and imports nothing outside itself.',
      from: { path: '^src/shared/domain/' },
      to: { pathNot: '^src/shared/domain/' },
    },
    {
      name: 'src-not-to-tests',
      severity: 'error',
      comment: 'server §5.4: src never imports tests.',
      from: { path: '^src/' },
      to: { path: '^tests/' },
    },
    {
      name: 'tests-to-client-only-dtos-mappers',
      severity: 'error',
      comment:
        'server §5.4: server tests may import only client/src/<feature>/data/{dtos,mappers} (contract test), nothing else from the client.',
      from: { path: '^tests/' },
      to: { path: CLIENT, pathNot: `${CLIENT}src/[^/]+/data/(?:dtos|mappers)/` },
    },
    {
      name: 'barrel-only-cross-module-imports',
      severity: 'error',
      comment: BARREL_COMMENT,
      from: { path: `^src/(${ROOTS})/([^/]+)/` },
      to: { path: MODULE_FILE, pathNot: [MODULE_BARREL, '^src/$1/$2/'] },
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
    // Server rules stop at the client boundary: only the direct tests → client edge is judged.
    doNotFollow: { path: ['node_modules', CLIENT] },
    parser: 'swc',
    tsPreCompilationDeps: true,
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
