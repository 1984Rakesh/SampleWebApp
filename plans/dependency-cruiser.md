# Plan: Enforce clean architecture with dependency-cruiser

## Status
- Feature branch: feat/dependency-cruiser
- Current phase: P2 — Fix existing violations
- Next task: P2.T1 (in progress, Devin)
- Last updated: 2026-10-25 by Manager (P1 complete)

## Goal
Make the clean-architecture rules machine-enforced. Add dependency-cruiser to `client/` and `server/` with error-level rules for layer boundaries, vendor-library allowlists, barrel-only cross-folder imports and no-orphans. Fix every existing violation and gate all PRs on it in CI. Done means `npm run check:architecture` passes on both sides in CI, and the rule docs describe the tool instead of saying architecture tooling is deferred.

## Feature Rules
- Follows plans/RULES.md
- The user has approved adding dependency-cruiser and a TS parser dependency, plus a `check:architecture` script (Decision 2026-10-25). Until P0.T2 merges, the repo docs still say otherwise; this plan overrides them.
- Phase 2 tasks are `refactor`: no behaviour or visual change; tests change only import paths.
- `comparison/presentation/models/comparisonData.ts` holds example code inside template strings. It is content, not imports; configs must not report it.

## Status Legend
`[ ]` todo · `[~]` in progress · `[r]` in review · `[x]` merged · `[!]` blocked · `[-]` dropped

## Phase 0 — CI and rule docs
Exit criteria: every PR to `feat/dependency-cruiser` runs the client and server verify commands in GitHub Actions. Rule docs state the agreed rules, no longer defer tooling, and the old ledger/skills are archived.

- [x] **P0.T1 — Add GitHub Actions CI**
  - Type: setup
  - Branch: task/dependency-cruiser/p0-t1
  - Base: feat/dependency-cruiser
  - PR: https://github.com/1984Rakesh/SampleWebApp/pull/1
  - Files: `.github/workflows/ci.yml`
  - Context: plans/RULES.md (Verify commands). There is no CI today. Client tests run sequentially with Vite SSR. Server tests need both apps' dependencies installed, because `server/tests/client-contract.test.ts` imports client code.
  - Do: Add one workflow on `pull_request` (all branches) and `push` to `main` and `feat/**`. Jobs: `client` (Node 24, `npm ci`, test, build, lint) and `server` (Node 24, `npm ci` in client and server, build, test, test:startup), plus a `git diff --check` step against the PR base. Cache npm per lockfile. Add no `check:architecture` yet (P3.T1 adds it).
  - Done when: the workflow runs on this PR and both jobs pass. No source files changed.
  - Depends on: —
  - Notes:
    - 2026-10-25 — Devin: added `.github/workflows/ci.yml` (only file changed besides this ledger). The `client` job runs `git diff --check HEAD^1 HEAD` on the PR merge commit, which checks the PR diff against its base. It runs on `pull_request` only, and push runs skip it. The `server` job runs `npm ci` in client then server. npm cache keyed per lockfile through `setup-node` `cache-dependency-path`. Concurrency cancels superseded runs. Actions pinned to `@v5` major tags. Local Node 24.22.1 run: client 65/65 tests, build, lint green. Server build, 29/29 tests, startup 3/3 green. Suggestion: pin actions to SHAs later if desired.
    - 2026-10-25 — Manager: reviewed (CI green, scope ok); squash-merged PR #1.

- [x] **P0.T2 — Update architecture rule docs for dependency-cruiser**
  - Type: setup
  - Branch: task/dependency-cruiser/p0-t2
  - Base: feat/dependency-cruiser
  - PR: https://github.com/1984Rakesh/SampleWebApp/pull/2
  - Files: `AGENTS.md`, `.devin/rules/clean-architecture.md`, `client/AGENTS.md`, `client/.devin/rules/client-architecture.md`, `server/AGENTS.md`, `server/.devin/rules/server-architecture.md`
  - Context: Decisions dated 2026-10-25 below (the whole list).
  - Do:
    1. Trim migration-history narrative (S4/C2–C5 status paragraphs, "migration complete" repeats, the stale "C2 security/profile/session complete" header) to one line saying the feature-first layout is in place. Keep every actual rule.
    2. Replace every "architecture checker tooling is deferred / do not add a parser dependency / no check:architecture script" statement with: boundaries are enforced by dependency-cruiser via `npm run check:architecture` per side; rules are error-level; never weaken a rule to pass; listed rules remain manual-review items.
    3. Add these rules:
       - (a) **Client:** no `src/lib/`. The `cn` helper lives in `components/ui/utils.ts`. Feature display copy lives in the owning feature, and App injects it into other features.
       - (b) **Client:** `components/app/` holds only feature-neutral blocks with semantic props, never feature-named ones (e.g. no TaskRow).
       - (c) **Server:** `dotenv` may be imported only by `server.ts` and `app/`. `process.env` is read only in `app/config.ts`.
       - (d) **Server:** `server/tests/` may import `client/src/<feature>/data/{dtos,mappers}` for the contract test, nothing else from the client.
       - (e) **Both:** imports from outside a module folder must go through that folder's `index.ts`. A module folder is `<feature>/<layer>/<sub>/` (e.g. `tasks/domain/models/`); for `app`, `foundation`, `shared` and `components` it is `<root>/<sub>/` (e.g. `components/ui/`). Imports inside the same module folder use relative paths. Barrels export only the folder's public API; internal pieces stay unexported.
       - (f) **Both:** no orphan source files except entries (`client/src/main.tsx`, `server/src/server.ts`) and `*.d.ts`.
    4. Update the Verification sections to add `npm run check:architecture`. Keep `git diff --check`.
  - Done when: `grep -rniE "deferred|parser dependency|invent .*check:architecture" AGENTS.md client/AGENTS.md server/AGENTS.md .devin/rules client/.devin server/.devin` returns nothing. Rules (a)–(f) appear in the matching side's rules file. No source code changed. CI is green.
  - Depends on: P0.T1
  - Notes:
    - 2026-10-25 — Devin: changed only the 6 listed docs. Migration narrative is trimmed to "feature-first layout is in place", with embedded rules kept. "Tooling deferred" lines are replaced by dependency-cruiser enforcement text. Rules: (a)/(b) in client rules §4.8–4.9 and client AGENTS §3. (c) in server rules §6 and server AGENTS §3. (d) in server rules §5.4 and server AGENTS §4. (e)/(f) in shared rules §7, client rules §6 and server rules §5. New shared rules §8 "Enforcement" lists the manual-review items. Verification sections add `npm run check:architecture`. Also: the client AGENTS tree now lists `components/app`. Done-when grep returns nothing; `git diff --check` is clean. Node/npm were unavailable locally, so client/server suites rely on CI (no source changed). Note: the docs reference `check:architecture` before P1 adds it; RULES.md "skip before P1" covers this.
    - 2026-10-25 — Manager: reviewed (CI green, scope ok, grep clean, rules a–f placed); squash-merged PR #2.

- [x] **P0.T3 — Archive the old ledger and remove the repo-local manager/worker skills**
  - Type: setup
  - Branch: task/dependency-cruiser/p0-t3
  - Base: feat/dependency-cruiser
  - PR: https://github.com/1984Rakesh/SampleWebApp/pull/3
  - Files: `plan-mui-shadcn-migration.md` → `plans/history/mui-shadcn-migration.md`, delete `.devin/skills/manager/`, `.devin/skills/worker/`
  - Context: Execution now follows the Devin "Plan Worker" playbook and plans/RULES.md. The repo-local skills use the old `plan-<name>.md` convention and conflict with it. The user approved this deletion (Decision 2026-10-25).
  - Do: `git mv` the MUI plan into `plans/history/` unchanged and delete the two skill folders. Leave `.devin/skills/mui-to-shadcn/` and `.devin/skills/clean-architecture-tasks-design/` untouched. Fix any doc links that pointed at the moved or deleted files.
  - Done when: `ls .devin/skills` shows only `mui-to-shadcn` and `clean-architecture-tasks-design`. The plan exists in `plans/history/`. `grep -rn "plan-mui-shadcn-migration\|skills/worker\|skills/manager" --include=*.md .` returns no stale links. CI is green.
  - Depends on: P0.T2
  - Notes:
    - 2026-10-25 — Devin: `git mv plan-mui-shadcn-migration.md plans/history/mui-shadcn-migration.md` (100% rename, content unchanged); `git rm -r .devin/skills/manager .devin/skills/worker` (each held only SKILL.md). `.devin/skills/mui-to-shadcn/` and `.devin/skills/clean-architecture-tasks-design/` untouched. No doc links needed fixing: a repo-wide grep (all file types) for `plan-mui-shadcn-migration`, `skills/worker`, `skills/manager`, `manager skill`, `worker skill` matched only the deleted skills themselves and this plan's P0.T3 task / Decisions entry. No client/server code changed, so side verify commands were not required; `git diff --check` clean.
    - 2026-10-25 — Manager: reviewed (CI green, 100% rename, scope ok); squash-merged PR #3.

## Phase 1 — Add dependency-cruiser (report only)
Exit criteria: `npm run check:architecture` runs on both sides with the full rule set at error severity and produces the baseline violation report. It is not yet in CI.

- [x] **P1.T1 — Client dependency-cruiser config**
  - Type: setup
  - Branch: task/dependency-cruiser/p1-t1
  - Base: feat/dependency-cruiser
  - PR: https://github.com/1984Rakesh/SampleWebApp/pull/4
  - Files: `client/package.json`, `client/package-lock.json`, `client/.dependency-cruiser.cjs`
  - Context: `client/.devin/rules/client-architecture.md` (after P0.T2). Client TS is 6.x, so the `tsc` parser works. tsconfig paths alias `@/*` → `src/*` (`client/tsconfig.app.json`).
  - Do: Add `dependency-cruiser` as a devDependency and script `"check:architecture": "depcruise src --config .dependency-cruiser.cjs"`. Point the config at `tsconfig.app.json` for alias resolution and set `tsPreCompilationDeps: true`. Every rule is `severity: 'error'`:
    - no-circular
    - not-to-unresolvable
    - no-orphans (except `src/main.tsx` and `*.d.ts`)
    - no non-package/dev deps in `src`
    - domain → only own feature domain + `shared/domain`, no npm or Node core
    - `domain/repositories` ↛ `domain/useCases`
    - feature ↛ `app/`
    - feature ↛ sibling feature
    - presentation ↛ data
    - data ↛ presentation
    - presentation ↛ axios, zod, @tanstack/react-query
    - `presentation/{screens,components}` ↛ domain
    - radix-ui, lucide-react, class-variance-authority, clsx, tailwind-merge, sonner and lowercase shadcn files in `components/ui/` importable only from `components/ui/` and `components/app/`
    - `components/`, `foundation/`, `shared/` ↛ features and App
    - `foundation/` ↛ `shared/data`
    - `shared/domain` ↛ anything outside `shared/domain`
    - barrel-only cross-module-folder imports, per P0.T2 rule (e)

    Give each rule a `comment` naming the doc rule it enforces. Do not fix any violations here.
  - Done when: `npm run check:architecture` runs, and the PR body has its full violation output. No rule is set to warn or info. `comparisonData.ts` template strings are not reported. A deliberately added `import axios from 'axios'` in a domain file is reported (show this, then revert it). Existing client verify commands pass.
  - Depends on: P0.T3
  - Notes:
    - 2026-10-25 — Devin: added `client/.dependency-cruiser.cjs`, `dependency-cruiser@18.6.0` (exact pin; 18.7.0 is under the 7-day minimum) and the `check:architecture` script. npm also pruned a stale optional-peer `yaml` lockfile entry. Config: `tsc` parser, `tsConfig: tsconfig.app.json`, `tsPreCompilationDeps: true`, all rules `error` with doc-section comments. A feature is any top-level `src/` folder except app/foundation/shared/components/assets, so `lib/` is checked as a feature. `no-orphans` uses native `orphan` plus `reachable: false` from `src/main.tsx` (native orphan misses files that import others). Barrel rule (e) is 3 rule objects that share one name, because back-references only flow from→to. Baseline: 213 errors (barrel 156, components/shared → `lib` 44, orphans 7, sibling → `lib` 4, ui-vendor in `lib/utils` 2), 0 layer-boundary hits. A temporary domain → axios import was reported. `comparisonData.ts` has 0 resolved deps. `npm test` 65/65, build and lint OK. Suggestion: a dedicated no-`src/lib` rule (doc rule (a)) was not added because it is not in Do.
    - 2026-10-25 — Manager: reviewed config + baseline (213: barrel 156, lib-related 50, orphans 7; 0 layer-boundary); squash-merged PR #4. Baseline counts are the Done-when reference for Phase 2.

- [x] **P1.T2 — Server dependency-cruiser config**
  - Type: setup
  - Branch: task/dependency-cruiser/p1-t2
  - Base: feat/dependency-cruiser
  - PR: https://github.com/1984Rakesh/SampleWebApp/pull/5
  - Files: `server/package.json`, `server/package-lock.json`, `server/.dependency-cruiser.cjs`
  - Context: `server/.devin/rules/server-architecture.md` (after P0.T2). Server TypeScript 7 has no JS compiler API. Use dependency-cruiser's `parser: 'swc'` with `@swc/core` as a devDependency, or another parser setup that works without TS 7's API; record the choice in Notes. Keep TS 7 as the build compiler.
  - Do: Add the devDependencies and script `"check:architecture": "depcruise src tests --config .dependency-cruiser.cjs"`. Every rule is `severity: 'error'`:
    - no-circular
    - not-to-unresolvable
    - no-orphans (except `src/server.ts`, `tests/**`, `*.d.ts`)
    - domain → only own feature domain + `shared/domain`, no npm or Node core
    - `domain/ports` ↛ `domain/useCases`
    - feature ↛ `app/`
    - feature ↛ sibling feature
    - presentation ↛ infrastructure
    - infrastructure ↛ presentation
    - express and zod only in feature presentation, `foundation/http`, `app/`
    - better-sqlite3 only in feature infrastructure, `foundation/database`, `app/`
    - bcrypt and jsonwebtoken only in `security/infrastructure/security`
    - dotenv only in `server.ts` and `app/`
    - `foundation/` ↛ features and App
    - `shared/domain` ↛ anything outside it
    - `src` ↛ `tests`
    - `tests` → client only via `client/src/*/data/(dtos|mappers)`
    - barrel-only cross-module-folder imports in `src` (rule e)

    Each rule gets a `comment`. Fix nothing.
  - Done when: `npm run check:architecture` runs, and the PR body has its full output. All rules are error-level. A deliberate `import express from 'express'` in a domain file is reported (shown, then reverted). Server verify commands pass.
  - Depends on: P1.T1
  - Notes:
    - 2026-10-25 — Devin: added `server/.dependency-cruiser.cjs`, devDeps `dependency-cruiser@18.6.0` + `@swc/core@1.16.18` (exact pins; 18.7.0 and 1.16.20 are under the 7-day minimum) and the `check:architecture` script. Parser choice: `parser: 'swc'`, `tsPreCompilationDeps: true`, no `tsConfig` (no server path aliases); TS 7 stays the build compiler; depcruise prints a non-fatal `missing-typescript-transpiler` notice. 21 rule objects, all `error`, client rule names/two-object no-orphans/three-object barrel rule mirrored. Client tree is `doNotFollow`, so only the direct tests→client edge is judged. Library allowlists apply `from: ^src/` (tests/errors.test.ts imports express types) and include `@types/*`. APP = `src/app/` + `src/server.ts`. Baseline: 130 errors = barrel 129 (features 93, shared/foundation 36) + tests-to-client 1 (`tests/client-contract.test.ts → client/src/tasks/domain/models/enums.ts`, a real rule (d) violation not covered by any Phase 2 task); 0 layer, library or orphan hits. A temporary domain → express import was reported; other rules were probed in a throwaway copy. Build, 29/29 tests, 3/3 startup pass; `git diff --check` clean. Suggestion: add client-style `no-non-package-json`/`not-to-dev-dep` rules later.
    - 2026-10-25 — Manager: reviewed (swc parser, all error-level, client tree doNotFollow); baseline 130 (barrel 129, tests→client domain 1); squash-merged PR #5. The tests→client hit is covered by new task P2.T11.

## Phase 2 — Fix existing violations
Exit criteria: `npm run check:architecture` reports 0 violations on both sides, with behaviour and visuals unchanged.

- [r] **P2.T1 — Move the `cn` helper into components/ui**
  - Type: refactor
  - Branch: task/dependency-cruiser/p2-t1
  - Base: feat/dependency-cruiser
  - PR: https://github.com/1984Rakesh/SampleWebApp/pull/6
  - Files: `client/src/lib/utils.ts` → `client/src/components/ui/utils.ts`, the ~48 importers under `client/src/components/{ui,app}/`, `client/components.json`
  - Context: P0.T2 rule (a). Only `components/ui` and `components/app` use `cn`.
  - Do: Move the file and update imports (relative inside `components/ui`, via `components/ui` barrel or allowed path from `components/app`). Set `components.json` `aliases.utils` to `@/components/ui/utils` and remove the `lib` alias.
  - Done when: `src/lib/utils.ts` no longer exists. No import of `@/lib/utils` remains. The client verify commands pass, apart from `check:architecture` violations outside this task's scope.
  - Depends on: P1.T2
  - Notes:
    - 2026-10-25 — Devin: `git mv src/lib/utils.ts src/components/ui/utils.ts` (content unchanged). 43 importers updated: 40 in `components/ui/` now import `./utils` (each file's quote style kept); the 3 in `components/app/` (Logo, StatCard, TaskRow) import `cn` from `../ui`, the barrel, which now ends with `export { cn } from './utils';`. `components.json`: `aliases.utils` → `@/components/ui/utils`, `lib` alias removed. No files outside the list. The plan's "~48 importers" was 43 in practice. `src/lib/task-labels.ts` is left for P2.T2. Client `check:architecture` 213 → 167: `ui-vendor-only-in-components-ui-app` 2 → 0, `shared-modules-not-to-features-or-app` 44 → 0; barrel 156, orphans 7 and sibling-feature 4 (all `lib/task-labels`) unchanged. The barrel and orphan hit lists are identical before and after. `npm test` 65/65, build, lint, `git diff --check` all pass. Note: `cn` is now public through `components/ui/index.ts`, so features could import it; P3.T1's planned `no-src-lib` rule does not cover that. The vendor allowlist still keeps clsx/tailwind-merge in components/ui.

- [ ] **P2.T2 — Make task status labels tasks-owned and App-injected**
  - Type: refactor
  - Branch: task/dependency-cruiser/p2-t2
  - Base: feat/dependency-cruiser
  - PR: —
  - Files: `client/src/lib/task-labels.ts` (delete), `client/src/tasks/presentation/models/taskPresentation.ts` (or a new `tasks/presentation/models/taskLabels.ts`), `client/src/dashboard/presentation/models/DashboardViewState.ts`, `client/src/dashboard/presentation/context/DashboardCapabilitiesContext.ts`, `client/src/dashboard/presentation/components/{DashboardStats,DashboardProgress}.tsx`, `client/src/profile/presentation/context/ProfileUseCasesContext.ts`, `client/src/profile/presentation/components/UserProfileCard.tsx`, `client/src/app/composition/{useDashboardCapabilities,useUserUseCases}.ts`, affected `client/tests/*`
  - Context: Today profile and dashboard import tasks display copy from `lib/task-labels.ts`, which is a hidden cross-feature dependency. Follow P0.T2 rule (a) and the `DashboardCapabilities` and profile task-counts pattern in `client/AGENTS.md` §2.
  - Do: Move the labels into tasks presentation. Add display-ready label fields to the dashboard and profile consumer-owned contracts, owned by those features: e.g. dashboard counts carry `{ label, value }`, or the capability supplies `statusLabels: { completed, inProgress, todo }`. App fills them from the tasks labels. Dashboard and profile stop importing anything task-related. Delete `src/lib/`.
  - Done when: `client/src/lib/` no longer exists. `grep -rn "task-labels\|@/lib" client/src` returns nothing. Rendered text is unchanged ("Done", "In progress", "To do"). The client verify commands pass, apart from `check:architecture` violations outside this task's scope.
  - Depends on: P2.T1
  - Notes:

- [ ] **P2.T3 — Replace TaskRow with a feature-neutral components/app block**
  - Type: refactor
  - Branch: task/dependency-cruiser/p2-t3
  - Base: feat/dependency-cruiser
  - PR: —
  - Files: `client/src/components/app/TaskRow.tsx` → `client/src/components/app/ChecklistRow.tsx`, `client/src/dashboard/presentation/components/DashboardRecentTasks.tsx`
  - Context: P0.T2 rule (b). Only dashboard uses it. Design reference: `.devin/skills/mui-to-shadcn/design-system/components/app/TaskRow.prompt.md`.
  - Do: Rename it and replace task-specific prop names and copy with semantic ones (e.g. `title`, `meta`, `checked`, `chips: { label, tone }[]`, `onToggle`). Keep markup and classes identical. Dashboard maps its ViewState to those props.
  - Done when: no file or export named `TaskRow` exists in `components/`. The rendered dashboard output in tests is unchanged. The client verify commands pass, apart from `check:architecture` violations outside this task's scope.
  - Depends on: P2.T2
  - Notes:

- [ ] **P2.T4 — Remove the orphaned Toast component**
  - Type: refactor
  - Branch: task/dependency-cruiser/p2-t4
  - Base: feat/dependency-cruiser
  - PR: —
  - Files: `client/src/components/feedback/Toast.tsx`
  - Context: Nothing imports it; toasts go through `UiToastHost`/sonner. The user approved deleting confirmed orphans (Decision 2026-10-25).
  - Do: Delete it after confirming with `npm run check:architecture` and grep that it has no importers. Barrel `index.ts` files reported as orphans are fixed by the barrel tasks, not here.
  - Done when: the file is gone, `no-orphans` reports nothing except unused barrels, and the client verify commands pass.
  - Depends on: P2.T3
  - Notes:

- [ ] **P2.T5 — Client barrels: security**
  - Type: refactor
  - Branch: task/dependency-cruiser/p2-t5
  - Base: feat/dependency-cruiser
  - PR: —
  - Files: `client/src/security/**/index.ts` (new), importers of security modules in `client/src/{security,app}/`, `client/tests/*`, `server/tests/client-contract.test.ts` (paths only, if needed)
  - Context: P0.T2 rule (e). Follow the existing barrels in `client/src/tasks/{domain,data}/*/index.ts`.
  - Do: Add `index.ts` to each security module folder that is imported from outside itself, exporting only its public API. Rewrite cross-folder imports to use the barrels.
  - Done when: `npm run check:architecture` reports no barrel violations whose target is under `src/security/`. Server tests still pass. The client verify commands pass.
  - Depends on: P2.T4
  - Notes:

- [ ] **P2.T6 — Client barrels: profile**
  - Type: refactor
  - Branch: task/dependency-cruiser/p2-t6
  - Base: feat/dependency-cruiser
  - PR: —
  - Files: `client/src/profile/**/index.ts`, importers in `client/src/{profile,app}/`, tests (paths only)
  - Context: same as P2.T5.
  - Do: Same as P2.T5, for profile.
  - Done when: no barrel violations target `src/profile/`. Client and server verify commands pass.
  - Depends on: P2.T5
  - Notes:

- [ ] **P2.T7 — Client barrels: tasks, dashboard, comparison**
  - Type: refactor
  - Branch: task/dependency-cruiser/p2-t7
  - Base: feat/dependency-cruiser
  - PR: —
  - Files: `client/src/{tasks,dashboard,comparison}/**/index.ts`, their importers, tests (paths only)
  - Context: same as P2.T5. Several barrels exist but nothing uses them yet (they show as orphans).
  - Do: Same as P2.T5, for these three features, and make existing unused barrels the import path.
  - Done when: no barrel or orphan violations target these features. Client and server verify commands pass.
  - Depends on: P2.T6
  - Notes:

- [ ] **P2.T8 — Client barrels: app, foundation, shared, components**
  - Type: refactor
  - Branch: task/dependency-cruiser/p2-t8
  - Base: feat/dependency-cruiser
  - PR: —
  - Files: `client/src/{app,foundation,shared,components}/*/index.ts`, their importers, `client/tests/*` (paths only)
  - Context: same as P2.T5. `components/ui/index.ts` already exists; the 7 direct `components/ui/Ui*` imports from outside it must switch to it.
  - Do: Same as P2.T5, for these module folders.
  - Done when: client `npm run check:architecture` reports **0 violations**, and all client verify commands pass.
  - Depends on: P2.T7
  - Notes:

- [ ] **P2.T9 — Server barrels: security, profile, tasks**
  - Type: refactor
  - Branch: task/dependency-cruiser/p2-t9
  - Base: feat/dependency-cruiser
  - PR: —
  - Files: `server/src/{security,profile,tasks}/**/index.ts` (new), importers in `server/src/`, `server/tests/*` (paths only)
  - Context: P0.T2 rule (e). There are no server barrels today (~95 cross-folder imports in features).
  - Do: Add barrels for each feature module folder imported from outside itself and rewrite the imports. If the diff exceeds ~40 files, stop after security, set the task to `[!]` and suggest the split in Blockers.
  - Done when: no barrel violations target server feature folders, and the server verify commands pass, including `test:startup`.
  - Depends on: P2.T8
  - Notes:

- [ ] **P2.T10 — Server barrels: foundation, shared, app**
  - Type: refactor
  - Branch: task/dependency-cruiser/p2-t10
  - Base: feat/dependency-cruiser
  - PR: —
  - Files: `server/src/{foundation/*,shared/domain}/index.ts`, `server/src/app/index.ts` if needed, importers, tests (paths only)
  - Context: same as P2.T9. `server.ts` (entry) imports `app/*`.
  - Do: Same as P2.T9, for these folders.
  - Done when: server `npm run check:architecture` reports **0 violations**, and the server verify commands pass.
  - Depends on: P2.T9
  - Notes:

- [ ] **P2.T11 — Contract test stops importing client domain enums**
  - Type: test
  - Branch: task/dependency-cruiser/p2-t11
  - Base: feat/dependency-cruiser
  - PR: —
  - Files: `server/tests/client-contract.test.ts`
  - Context: P1.T2 baseline: `tests/client-contract.test.ts → ../client/src/tasks/domain/models/enums.ts` (`TaskPriority`, `TaskStatus`) violates server rule §5.4 (tests may import only `client/src/<feature>/data/{dtos,mappers}`).
  - Do: Replace the enum imports with the API's string literals (`'TODO' | 'IN_PROGRESS' | 'COMPLETED'`, and the priority values). Keep every assertion's meaning. Import nothing else from client domain.
  - Done when: server `npm run check:architecture` reports 0 `tests-to-client-only-dtos-mappers` hits, and the server verify commands pass with the same test count (29).
  - Depends on: P2.T10
  - Notes:

## Phase 3 — Enforce in CI
Exit criteria: CI fails any PR with an architecture violation, and the docs list the check as a required verify step.

- [ ] **P3.T1 — Gate CI on check:architecture**
  - Type: setup
  - Branch: task/dependency-cruiser/p3-t1
  - Base: feat/dependency-cruiser
  - PR: —
  - Files: `.github/workflows/ci.yml`, `client/.dependency-cruiser.cjs`, `server/.dependency-cruiser.cjs`
  - Context: P0.T1 workflow; both sides now report 0 violations.
  - Do: Add a `npm run check:architecture` step to the client and server jobs. In `client/.dependency-cruiser.cjs`, add an error-level rule `no-src-lib` forbidding any dependency on `^src/lib/` (doc rule (a); suggested in P1.T1). In `server/.dependency-cruiser.cjs`, add the client's `no-non-package-json` and `not-to-dev-dep` rules for `src` (parity; suggested in P1.T2).
  - Done when: CI is green on this PR. In a throwaway commit on the task branch (reverted before review), a domain → axios import makes the client job fail; link that failed run in the PR.
  - Depends on: P2.T11
  - Notes:

## Decisions
- 2026-10-25 — Add dependency-cruiser per side (client uses its TS 6 parser; server needs a non-TS-7 parser) (user choice; TS 7 lacks a JS compiler API).
- 2026-10-25 — All rules error-level from the start; fix violations in Phase 2 before CI gating (user choice; code is already nearly clean).
- 2026-10-25 — Remove `client/src/lib/`: `cn` → `components/ui/utils.ts`; task labels tasks-owned and App-injected into dashboard/profile (user choice; strict feature isolation).
- 2026-10-25 — `components/app` holds only feature-neutral blocks; TaskRow becomes generic (user choice).
- 2026-10-25 — `dotenv` allowed in `server.ts` bootstrap and `app/`; `process.env` only in `app/config.ts` (user choice; no code change).
- 2026-10-25 — Trim migration history from rule docs and replace the "tooling deferred" statements (user choice).
- 2026-10-25 — Archive `plan-mui-shadcn-migration.md` to `plans/history/`; delete repo-local manager/worker skills; Devin follows the Plan Worker playbook (user choice).
- 2026-10-25 — Enforce barrel-only cross-module-folder imports and no-orphans (user choice; the barrel rule touches ~340 imports, so it is split by feature).
- 2026-10-25 — Server tests may import client `data/{dtos,mappers}` only, for the contract test (existing deliberate coupling).

## Open Questions
- [x] Devin GitHub integration and repository connected (2026-10-25)

## Blockers
- —

## Change Log
- 2026-10-25 — Manager: created plan after rules audit (import-graph audit: 0 layer violations; lib/, TaskRow, orphans and barrels need work).
- 2026-10-25 — Manager: dispatched P0.T1 to Devin.
- 2026-10-25 — Manager: P0.T1 merged (PR #1).
- 2026-10-25 — Manager: dispatched P0.T2 to Devin.
- 2026-10-25 — Manager: P0.T2 merged (PR #2).
- 2026-10-25 — Manager: dispatched P0.T3 to Devin.
- 2026-10-25 — Manager: P0.T3 merged (PR #3); Phase 0 complete.
- 2026-10-25 — Manager: dispatched P1.T1 to Devin.
- 2026-10-25 — Manager: P1.T1 merged (PR #4). Revised P3.T1 Do: add explicit `no-src-lib` client rule.
- 2026-10-25 — Manager: dispatched P1.T2 to Devin.
- 2026-10-25 — Manager: P1.T2 merged (PR #5); Phase 1 complete. Added P2.T11 (contract test enum import); P3.T1 now depends on P2.T11, also adds server parity rules, Files updated.
- 2026-10-25 — Manager: dispatched P2.T1 to Devin.
