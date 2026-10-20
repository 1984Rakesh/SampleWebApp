# Plan: client-verticals

**Goal:** Finish the client feature-first Clean Architecture migration — move tasks, dashboard, and comparison out of the legacy layer-first roots into `client/src/<feature>/`, retire all legacy roots/shims, and finalize rules and audits. Picks up where the old C2 checkpoint stopped (server phases + C1/C2 are done).

**Status:** Phase 3 – Final audit & docs · COMPLETE (acceptance passed) · ALL PHASES DONE — migration finished · updated 2026-10-20

## Global Rules

- Building blocks: `Foundation → Features → App`. Imports: `App → Features / Foundation`. Within a feature: `presentation → domain ← data`.
- App alone constructs repositories/use cases and adapts cross-feature contracts (`client/src/app/composition/`, `app/providers/`). Feature consumers use consumer-owned contexts in their own `presentation/context/`; never import App or sibling feature internals.
- Feature `domain/` is pure TypeScript: no React, Axios, Zod, React Query, MUI, browser APIs, foundation, data, presentation, or App imports.
- Preserve all API paths/payloads, browser routes, localStorage keys (`accessToken`, `refreshToken`, `user`), task status/priority values, UI behavior, and visual design. No new server endpoints; comparison stays client-only.
- MUI/`@mui` imports only inside `client/src/components/ui/` and `client/src/foundation/theme/`. Screens/components render ViewState primitives and `SelectOption`s, never domain entities/enums.
- Nullable/patch semantics: `undefined` = preserve, `null`/empty = clear, non-empty = update — through DTOs, mappers, and domain inputs.
- Data layer translates Axios/Zod/transport errors via `shared/data/translateError.ts` before they reach ViewModels; no raw error leakage, no catch-and-rethrow without translation.
- **No new dependencies.** Tests use Node test runner + Vite SSR, run with `--test-concurrency=1`. Architecture checker stays deferred — manual import audits only; do not add a parser or a `check:architecture` script.
- Do not create compatibility shims/re-exports that point legacy paths at new feature paths. Update import sites instead.
- When client DTOs/mappers/models move, update `server/tests/client-contract.test.ts` import paths and rerun the server suite — it is the cross-app contract gate.
- Remove now-empty directories and dead barrels as each migration finishes; do not leave `index.ts` files exporting nothing or deleted paths.

## Phases

### Phase 1 – Tasks vertical (was C3)
**Acceptance check:** `cd client && npm test -- --test-concurrency=1 && npm run build && npm run lint` clean; `cd server && npm test && npm run test:startup` clean; `git diff --check` clean; `client/src/domain`, `client/src/data` task files and all task presentation files gone; task UI behaves identically (list/filter/search/create/edit/delete/toggle, navbar create dialog).

- [x] **P1.1** Migrate task domain
  - Files: `client/src/domain/models/Task.ts`, `models/enums.ts`, `models/index.ts`, `domain/repositories/TaskRepository.ts`, `domain/useCases/{Create,Update,Delete,ToggleTaskStatus,GetTasks}TaskUseCase.ts` + `useCases/index.ts` → `client/src/tasks/domain/{models,repositories,useCases}/`
  - Done when: task models/enums/repository contract/use cases live under `tasks/domain/`; no React/Axios/Zod/foundation/App imports inside it; legacy `src/domain/` has no task files left.
  - Depends on: –
  - Notes: keep `nextTaskStatus`, input types, title normalization, tri-state patch semantics exactly as-is; this is a move, not a redesign.
  - 2026-10-20: Done. `git mv`'d all task domain files to `client/src/tasks/domain/{models,repositories,useCases}`; updated import sites in `data/` (repository, schemas, mapper), `presentation/` (context, taskPresentation, useTaskListViewModel), `app/composition/useTaskUseCases.ts`, and `server/tests/client-contract.test.ts`. Removed empty `client/src/domain/`. Verified: domain has zero non-relative imports; client build + 23 tests pass; server 29 tests pass; lint clean; `git diff --check` clean. comparisonData.ts snippet strings left for P2.2 (content, not imports).

- [x] **P1.2** Migrate task data layer
  - Files: `client/src/data/api/TaskApi.ts`, `data/dtos/{TaskDTO.ts,schemas.ts}`, `data/mappers/TaskMapper.ts`, `data/repositories/ReactQueryTaskRepository.ts` (+ `index.ts` barrels) → `client/src/tasks/data/{api,dtos,mappers,repositories}/`; update `server/tests/client-contract.test.ts` task import paths.
  - Done when: task API/DTOs/schemas/mapper/React Query adapter live under `tasks/data/`; errors translate via `shared/data/translateError`; React Query keys/mutations unchanged; server contract suite passes with updated import paths.
  - Depends on: P1.1
  - Notes: apply the pending "task nullable-input/error refinements" noted in `client/AGENTS.md` §3 — nullable `description`/`dueDate` inputs must carry `string | null | undefined` cleanly to the DTO boundary.
  - 2026-10-20: Done. `git mv`'d api/dtos/mappers/repositories to `tasks/data/`; removed empty `client/src/data/`. Applied refinements: `description`/`dueDate` now `string | null | undefined` in `Create/UpdateTaskInput` and `Create/UpdateTaskDTO`; `taskApi` converted to `createTaskApi(client)` factory using `atDataBoundary`; `toDomain` wraps `taskSchema.parse` in `translateError`; new `HttpTaskRepository.ts` (`createTaskRepository(api)`) implements the domain contract and owns DTO mapping; `useTaskRepository(source)` is now a pure React Query wrapper (same `['tasks', status, priority]` keys + invalidation); App (`useTaskUseCases.ts`) constructs the concrete adapter like profile. Fixed `TaskApi` foundation path and server contract test imports. Verified: client build + 23 tests + lint clean; server 29 tests clean; `git diff --check` clean.

- [x] **P1.3** Migrate task presentation
  - Files: `client/src/presentation/{models/TaskFormViewState.ts, models/TaskListViewState.ts, models/taskPresentation.ts}`, `hooks/{useTaskListViewModel.ts, useTaskFormViewModel.ts}`, `screens/TaskListScreen.tsx`, `components/{TaskDialog,TaskForm,TaskCard,TaskFilters,TaskListContent,TaskListHeader,Badge}.tsx`, `components/taskList/*` → `client/src/tasks/presentation/{context,models,hooks,screens,components}/`
  - Done when: tasks own their ViewStates, presentation mappers, ViewModels, screens, components, and a tasks-owned use-cases consumer context (replacing `presentation/context/FeatureUseCasesContext` task half). Screens/components use ViewState + SelectOption, no domain enums in render props.
  - Depends on: P1.1
  - Notes: create `tasks/presentation/context/TaskUseCasesContext.ts` exposing today's `TaskUseCases` shape. `Badge` goes with tasks (it renders task status/priority); `CodeBlock`/`ComparisonPanel`/`LayerMap` stay legacy until P2. Decide whether the context exposes the query-based shape or plain use-case functions — keep behavior identical either way.
  - 2026-10-20: Done. `git mv`'d models/hooks/screens/components (+ taskList/) to `tasks/presentation/`; fixed `components/ui` depths, domain paths. Created `TaskUseCasesContext` keeping the React Query–backed `useTasksQuery` shape (Q1 resolved: query-based). Removed task half from `FeatureUseCasesContext` (now `useProfileSummary`-only); provider nests `TaskUseCasesContext.Provider` inside profile context. Trimmed task entries from all legacy barrels; created tasks context/hooks/components barrels. Updated consumers: AppNavbar TaskDialog, AppRouter lazy path, useUserUseCases `toTaskCounts`, dashboard ViewModel/components/models now import tasks presentation (interim cross-feature imports until P2.1 DashboardCapabilities). Fixed `composition.test.mjs` to load the new context. Verified: build + 23 tests + lint + `git diff --check` clean; no domain imports in task .tsx files.

- [x] **P1.4** Rewire App and retire legacy task roots
  - Files: `client/src/app/composition/useTaskUseCases.ts`, `app/composition/AppNavbar.tsx` (TaskDialog import), `app/providers/FeatureUseCasesProvider.tsx`, `app/router/AppRouter.tsx` (TaskListScreen lazy path), `client/src/presentation/{components,hooks,models,screens}/index.ts` barrels, `client/tests/*`.
  - Done when: App constructs the tasks repository/use cases from `tasks/` and injects them via the new tasks context; navbar renders `tasks/presentation/components/TaskDialog`; `client/src/domain/` and `client/src/data/` are empty and removed; no imports reference `src/domain`, `src/data`, or `presentation/components/task*` paths.
  - Depends on: P1.2, P1.3
  - Notes: dashboard still consumes task data through the legacy `FeatureUseCasesContext` — keep the `useTasksQuery`/`TaskUseCases` contract feeding `useDashboardProfile`/`tasks` until P2.1 replaces it; do not break dashboard mid-phase.
  - 2026-10-20: Done. App rewiring was completed during P1.3 (provider nests `TaskUseCasesContext`; AppNavbar renders `tasks/` TaskDialog; router lazy-loads `tasks/` TaskListScreen; `useUserUseCases` sources `toTaskCounts` from `tasks/`). Verified `client/src/domain` and `client/src/data` are gone, no stale imports of legacy task paths (all remaining `../../domain` imports are within-feature). Dashboard keeps working via interim imports of `tasks/presentation` internals — documented, resolved by P2.1 `DashboardCapabilities`. `FeatureUseCasesContext` retains `useProfileSummary` for dashboard per note. **Phase 1 acceptance passed:** client 23 tests + build + lint clean; server 29 tests + 3 startup smokes clean; `git diff --check` clean. Empty `foundation/{auth,context}` dirs remain for P2.3 per plan.

### Phase 2 – Dashboard & comparison verticals (was C4)
**Acceptance check:** client test/build/lint clean; `client/src/presentation/` and `client/src/foundation/{auth,context}` empty and removed; dashboard greeting/counts/recent tasks and comparison screen render identically; manual audit shows no sibling ViewModel imports.

- [x] **P2.1** Create `client/src/dashboard/` feature
  - Files: `presentation/hooks/useDashboardViewModel.ts`, `models/{DashboardViewState.ts,dashboardPresentation.ts}`, `screens/DashboardScreen.tsx`, `components/{DashboardStats,DashboardRecentTasks,DashboardProgress}.tsx` → `client/src/dashboard/presentation/{context,models,hooks,screens,components}/`
  - Done when: dashboard ViewModel consumes injected contracts only — a dashboard-owned `DashboardCapabilities` context supplying `{ profileName, isLoading }` + display-ready task items/counts/toggle — never `useTaskListViewModel` or task/profile internals. App (`FeatureUseCasesProvider` or new adapter) maps tasks query results into that contract.
  - Depends on: P1.4
  - Notes: follow the security/profile precedent: feature-owned context + App-injected adapter. Toggle action is a callback taking a task id, not a task ViewModel passthrough.
  - 2026-10-20: Done. `git mv`'d dashboard models/hooks/screen/components to `dashboard/presentation/`; defined dashboard-owned `DashboardTaskItem`/`DashboardTaskCounts`/`DashboardViewState` types (structurally mapped by App via tasks' `toTaskItemViewState`/`toTaskCounts`). New `DashboardCapabilitiesContext` (`{ profileName, isProfileLoading, taskItems, counts, isTasksLoading, errorMessage, toggleTaskStatus(id) }`); `useDashboardViewModel` consumes it only. New `app/composition/useDashboardCapabilities.ts` adapter: tasks query + `nextTaskStatus`/`toggleTaskStatus` mapping, profile-name logic preserved (`data?.name || user?.name || 'User'`), toggle errors swallowed (dashboard never surfaced them). `FeatureUseCasesProvider` now nests `DashboardCapabilitiesContext.Provider`; `FeatureUseCasesContext` no longer provided (file deleted in P2.3). Router lazy path updated; legacy hooks/screens barrels trimmed. Verified: client build + 23 tests + lint + `git diff --check` clean; zero `tasks/` imports inside `dashboard/`.

- [x] **P2.2** Create `client/src/comparison/` feature
  - Files: `presentation/{hooks/useComparisonViewModel.ts, models/comparisonData.ts, screens/ComparisonScreen.tsx, components/{ComparisonPanel,LayerMap,CodeBlock}.tsx}` → `client/src/comparison/presentation/{models,hooks,screens,components}/`
  - Done when: comparison is presentation-only under `comparison/` (no artificial domain/data layers); `comparisonData.ts` embedded snippets updated to describe the current feature-first `foundation → features → App` layout rather than the old layer-first paths.
  - Depends on: –
  - Notes: snippet strings are content, not imports — update prose/import examples inside strings carefully so they match the real tree (security/profile/tasks/domain+data+presentation, `app/` composition).
  - 2026-10-20: Done. `git mv`'d all comparison files to `comparison/presentation/`; fixed `components/ui` depths; added feature barrels. Snippet updates: AuthContext `User`→`Account` from `../../domain/models`; use-case imports `'./models'`→`'../models'`; API snippet rewritten to `createTaskApi(client)` factory with DTOs from `'../dtos'`; mapper `'./schemas'`→`'../dtos/schemas'`; repository snippet uses `createTaskApi`/`toDomain`/`GetTasksInput` from `'../../domain/models'`; ViewModel snippet consumes `useTaskUseCases()` from `'../context'`; TaskCard snippet uses real `./Badge` (`label` prop); route guards `useAuth` from `'../../security/presentation/context'`. LayerMap descriptions/data-flow updated to feature-first + App composition line. Deleted emptied legacy barrels (components/hooks/models/screens index.ts); `presentation/` now holds only `context/` for P2.3. Router lazy path updated. Verified: build + 23 tests + lint + `git diff --check` clean.

- [x] **P2.3** Retire legacy presentation/foundation roots
  - Files: `client/src/presentation/**` (remaining barrels, `context/FeatureUseCasesContext.ts`), `client/src/foundation/{auth,context}/` empty dirs, `app/providers/FeatureUseCasesProvider.tsx`, `app/router/AppRouter.tsx` lazy paths, `client/tests/*`.
  - Done when: `client/src/presentation/` and `client/src/domain/`, `client/src/data/` no longer exist; profile-summary contract moves to a dashboard-owned consumer context; `FeatureUseCasesContext` is deleted and each feature consumes its own context; router imports point at feature screens.
  - Depends on: P2.1, P2.2
  - Notes: profile's display-only task-counts injection (profile consumer context ← App) already exists; verify it now sources from `tasks/`, not a legacy path.
  - 2026-10-20: Done. Deleted `src/presentation/` entirely (`FeatureUseCasesContext` + barrel — unused since P2.1) and empty `foundation/{auth,context}` dirs. `src/` is now purely `app/`, features (`security`, `profile`, `tasks`, `dashboard`, `comparison`), `foundation/`, `shared/`, `components/` + entry files. Router lazy paths all point at feature screens; `useUserUseCases` `toTaskCounts` confirmed sourcing from `tasks/presentation`. No test changes needed (composition.test.mjs loads only feature contexts). **Phase 2 acceptance passed:** client 23 tests + build + lint clean; server 29 tests + 3 startup smokes clean; `git diff --check` clean. Manual audit: zero `@mui` outside `components/ui` + `foundation/theme`; feature domains pure (no react/axios/zod/RQ/foundation/App imports); no sibling feature implementation imports (all cross-feature flow via App-injected contexts); foundation/shared/components have no feature/App imports.

### Phase 3 – Final audit & docs (was C5)
**Acceptance check:** all of: `cd client && npm test -- --test-concurrency=1 && npm run build && npm run lint`; `cd server && npm test && npm run test:startup`; `git diff --check`; manual import audit results documented in Decisions.

- [x] **P3.1** Full import-boundary audit
  - Files: whole `client/src/` tree; use `grep`/IDE, no new tooling.
  - Done when: verified — (a) no feature domain imports React/Axios/Zod/RQ/MUI/foundation/App; (b) foundation imports no feature/App; (c) `@mui` only in `components/ui` + `foundation/theme`; (d) no cross-feature implementation imports (all cross-feature flow via App-injected consumer contracts); (e) no stale imports of deleted legacy paths anywhere incl. tests. Findings written to Decisions.
  - Depends on: P2.3
  - Notes: also confirm no leftover empty directories under `client/src/`.
  - 2026-10-20: Done. (a) Domain trees import only relative paths + `shared/domain/{errors,validation}` — zero React/Axios/Zod/RQ/MUI/foundation/App. (b) `foundation/`, `shared/`, `components/` have no feature/App imports. (c) `@mui`/`@emotion` appear only under `components/ui/` + `foundation/theme/`. (d) No cross-feature implementation imports — dashboard/comparison greps surface only within-feature relatives; all cross-feature flow via App-injected contexts (`DashboardCapabilities`, `TaskUseCases`, profile consumer context). (e) All remaining `/domain/` + `/data/` path references are App→feature composition imports (legal) or within-feature relatives; no `src/presentation`, `src/domain`, `src/data`, or `FeatureUseCasesContext` references anywhere incl. `client/tests` + `server/tests`. `comparisonData.ts` axios/zod/RQ hits are template-string snippet content, not imports. Zero empty dirs under `client/src`; all barrels non-empty. Layer-direction check: feature data layers never import presentation/App; presentation never imports data/axios/zod/RQ. Findings recorded in Decisions.

- [x] **P3.2** Finalize rules & instructions
  - Files: `client/AGENTS.md`, `client/.devin/rules/client-architecture.md`, `AGENTS.md`, `.devin/rules/clean-architecture.md`, `server/AGENTS.md`, `server/.devin/rules/server-architecture.md`.
  - Done when: all migration-status/checkpoint text reflects completed migration (no "pending C3/C4", no legacy-path caveats); trees match reality; remediation recipes no longer reference deleted legacy locations.
  - Depends on: P3.1
  - 2026-10-20: Done. `client/AGENTS.md`: checkpoint → "migration complete"; tree now shows tasks/dashboard/comparison features and drops legacy `domain/`/`data/`/`presentation/` roots; §2 dashboard bullet → `DashboardCapabilities`; §3 recipes updated (Badge/CodeBlock feature-owned, task-barrel/legacy-debt recipe generalized). `client-architecture.md`: C2 checkpoint → migration complete + presentation-only dashboard/comparison; §3.1 DTO rule → `<feature>/data/dtos`; §4.2 → DashboardCapabilities, §4.3 → `<feature>/presentation/components`. `AGENTS.md`: checkpoint → migration complete; §4.4 → all consumer contexts feature-owned. `clean-architecture.md`: status label + migration bullet → complete; boundary-mapping and data-boundary lines dropped legacy-path caveats; §6 decomposition line targets feature paths only. `server/AGENTS.md` + `server-architecture.md`: status sentences updated to "client migration complete". Verified via grep: zero remaining C3/C4/pending/legacy-caveat references (remaining "legacy" hits are correct field-alias/removed-roots usage).

- [x] **P3.3** Final regression pass
  - Files: `client/tests/*`, `server/tests/*`.
  - Done when: client 23+ tests pass, server 29 tests + 3 startup smokes pass, builds/lint/whitespace clean; test coverage still exercises session/refresh/profile-sync/task flows after moves.
  - Depends on: P3.2
  - Notes: update any test import paths broken by moves; keep `--test-concurrency=1`.
  - 2026-10-20: Done. Client: 23/23 tests (`--test-concurrency=1`), build clean (794 kB bundle, pre-existing chunk-size warning only), oxlint 0 warnings/0 errors on 175 files. Server: 29/29 tests + 3/3 startup smokes. `git diff --check` clean; working tree shows only the six docs + plan modified (P3.2). No test import paths needed fixing — P3.1 audit already confirmed none. Coverage intact: composition.test.mjs + security-session.test.mjs still exercise session/refresh/profile-sync/provider flows; server suite covers task/auth/profile boundaries + client-contract compatibility. **Phase 3 acceptance passed:** all four acceptance checks green (client test/build/lint; server test/startup; git diff --check; P3.1 audit findings in Decisions). Migration complete.

## Decisions
| Date | Decision | Why |
|------|----------|-----|
| 2026-01-15 | Plan created as `client-verticals` covering old C3–C5 | Previous plan completed through C2; remaining client phases need worker-sized tasks. |
| 2026-01-15 | Dashboard gets injected `DashboardCapabilities`, not task ViewModel | Prior decision: no sibling ViewModel imports; App adapts task data into dashboard's consumer contract. |
| 2026-01-15 | `Badge` migrates with tasks; `CodeBlock`/`LayerMap`/`ComparisonPanel` with comparison | They render feature-specific content; shared `components/` stays feature-independent. |
| 2026-10-20 | Q1 answered: tasks context keeps the React Query–backed `useTasksQuery` shape | Behavior identical; matches profile/security precedent of data-owned query adapters. |
| 2026-10-20 | Phase 1 accepted | P1.1–P1.4 verified: client 23 tests/build/lint, server 29 tests + 3 smokes, `git diff --check` all clean. Dashboard's interim imports of `tasks/presentation` are resolved by P2.1 `DashboardCapabilities`. |
| 2026-10-20 | Q2 resolved without issue | `FeatureUseCasesContext` split cleanly into per-feature contexts and was deleted in P2.3; no contract divergence. |
| 2026-10-20 | Phase 2 accepted | P2.1–P2.3 verified on disk: `src/presentation/` and empty `foundation/{auth,context}` removed; dashboard uses injected `DashboardCapabilities`; comparison presentation-only with updated snippets; builds/tests clean. |
| 2026-10-20 | P3.1 import audit clean | Greps confirm: pure feature domains (relative + shared/domain only), foundation/shared/components import no features/App, `@mui` confined to `components/ui` + `foundation/theme`, no sibling feature implementation imports (cross-feature flow solely via App-injected consumer contexts), no stale legacy path references in src or tests, no empty dirs/dead barrels. `comparisonData.ts` framework mentions are snippet strings. |
| 2026-10-20 | Phase 3 accepted — plan complete | P3.1–P3.3 verified: import audit clean, six docs finalized, client 23 tests/build/lint + server 29 tests/3 smokes + `git diff --check` all green. Client feature-first migration fully done. |

## Risks & Open Questions
- (none open)

## Inbox (worker → manager)
- (empty)
