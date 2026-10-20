# Clean Architecture Agent Instructions (Shared)

Apply these instructions and the [shared architecture rules](./.devin/rules/clean-architecture.md) to every feature, bug fix and refactor. Existing violations are not precedents; remediate those within task scope with regression tests.

## 1. Required Instructions

Before changing a side, read its instructions and rules:
- Shared: this file and [shared rules](./.devin/rules/clean-architecture.md).
- Server: [server/AGENTS.md](./server/AGENTS.md) and [server architecture](./server/.devin/rules/server-architecture.md).
- Client: [client/AGENTS.md](./client/AGENTS.md) and [client architecture](./client/.devin/rules/client-architecture.md).

## 2. Target Architecture and Migration Status

```text
Building blocks: Foundation → Features → App
Imports:         App → Features / Foundation
Within features: Presentation → Domain ← Data / Infrastructure
```

App binds features and performs DI, provider/route/shell registration and cross-feature adaptation. Foundation provides generic technical capabilities; it never imports features or App. Feature domains are pure TypeScript and never import foundation, frameworks, browser/server APIs or outer layers. Feature outer layers may use appropriate foundation capabilities. Cross-feature dependencies use narrow consumer-owned contracts injected by App, never sibling ViewModel/repository implementation imports.

Target server modules: `app/`, `foundation/`, `security/`, `profile/`, `tasks/`, `shared/`, with thin `server.ts`. Target client modules add `dashboard/`, `comparison/`, shared `components/`, thin `App.tsx` and `main.tsx`. Within each feature use domain/infrastructure/presentation on server and domain/data/presentation on client as applicable; no empty layers for symmetry.

**Migration complete (server and client accepted).** All client features — security, profile, tasks, dashboard, comparison — own their layers under `client/src/<feature>/`; no legacy layer-first roots remain. App maps account/profile/session/cache representations and injects display-only cross-feature capabilities (`DashboardCapabilities`, profile task-counts). Foundation exposes generic transport/storage/theme only, with no feature/App imports. Token refresh/signout/expiry are security-owned and wired through App; profile read/update ordering and authentication generations protect newer sessions/results. Public API/browser routes and stored user/token formats remain compatible.

## 3. Implementation Workflow

1. Define owned domain models/value types/normalization/errors, repository or port contracts and single-operation use cases. Ports depend only on models/minimal shared domain, never use cases. Every read and write goes through a use case and contract.
2. Implement owned data/infrastructure adapters with explicit persistence/DTO/domain mappings and boundary error translation. Reuse generic foundation mechanisms, not sibling feature internals.
3. Update presentation: server structural schemas/controllers/routes/response mapping; client presentation mappers/ViewState, ViewModels and prop-driven screens/components. Never leak DTOs, raw driver/HTTP errors or domain entities into UI.
4. Bind concrete implementations and cross-feature contracts at the App edge: server `src/app/container.ts`; client `src/app/composition/` and `src/app/providers/`. ViewModels consume contracts owned in their presentation layer, never App modules. All feature consumer contexts are feature-owned (`<feature>/presentation/context/`).
5. Update affected instructions/rules/links/diagrams alongside the actual migration. Shared docs distinguish target versus legacy paths; client instructions change only during client phases.

## 4. Self-Audit

- No domain imports of foundation, data/infrastructure, presentation, App, React, Express, Axios, Zod, SQLite, crypto implementations or environment/browser APIs.
- No upward repository/port imports from useCases; command/filter types belong to owned domain models.
- No foundation imports of features/App; no shared-kernel feature entities or frameworks; no feature-to-App service locator dependencies.
- DI/concrete feature construction and cross-feature synchronization live in App, not foundation or UI.
- Reads and writes go through focused use cases and domain repository contracts.
- Explicit Persistence Row ↔ Domain ↔ DTO ↔ ViewState mappings normalize then validate; never fabricate persisted IDs/ownership/enums.
- Database/JWT/transport errors are translated at boundaries; public error envelopes and status codes remain consistent.
- Nullable updates distinguish omitted/undefined, explicit null/empty, and non-empty values through schemas/mappers/SQL.
- Client components render ViewState/primitives/options, not raw domain entities/enums. ViewModels own form state/validation/actions.
- Vendored shadcn/ui primitives, radix-ui, lucide-react and Tailwind composition stay inside `client/src/components/ui/` and `client/src/components/app/`. No component-library prop types or class passthroughs leak into consumers. Shared UI contracts such as SelectOption belong to components/ui; shared components must not import business domain/data/App or feature components.
- Split multi-region render bodies into feature-owned controlled subcomponents. Shared components stay feature-independent; App wires dashboard/navbar capabilities and tasks-owned dialogs.
- Preserve APIs, browser routes, database schema/data, stored-session compatibility and UI behavior during reorganization.

## 5. Verification

Run checks for every modified side:

```bash
# Server
cd server && npm run build && npm test && npm run test:startup

# Client (when modified)
cd client && npm test && npm run build && npm run lint

# Repository whitespace
git diff --check
```

Server tests typecheck before executing and use disposable databases/ephemeral listeners only. Never run fixtures against existing database files or import the persistent startup module. Architecture checker tooling is deferred by user choice; manual import audits remain required, and builds/tests do not replace them. Do not invent a check:architecture script or add a parser dependency without approval. Fix newly introduced failures before completing a phase.
