---
description: "React client clean architecture rules"
trigger: always_on
---

# Client Clean Architecture Rules (React)

Extend the [shared rules](../../../.devin/rules/clean-architecture.md). Inside a feature: Presentation → Domain ← Data. The dependency-cruiser config cites these section numbers; keep them stable.

## 1. Module and Layer Dependencies

| Module | Allowed | Forbidden |
| :--- | :--- | :--- |
| Domain | Own models/repositories/use cases, `shared/domain` | App, foundation, outer layers, frameworks, browser APIs |
| Data | Own domain/data, generic foundation transport, `shared/data` | App, presentation, sibling features |
| Presentation ViewModels/mappers | Own domain/presentation, injected consumer contracts, generic foundation hooks | App, data implementations, Axios/Zod/React Query |
| Screens/feature components | ViewState, options, callbacks, own presentation, shared UI | Domain entities/enums, App/data, vendored UI primitives |
| Shared components | Own UI contracts/components, generic theme | App, features, business models, data |
| Foundation | Generic capabilities and permitted libraries | App, features, business policy |
| App | All layers, for binding/providers/routes/shell | Business invariants, duplicate domain validation |

- Foundation is generic network (callbacks in, generic `HttpError` out), storage and theme; no feature, App or domain-model imports.
- `shared/data` holds common boundary error translation (may use transport errors and Zod), never domain policy.
- Presentation-only features have no domain/data layers. Each feature owns its consumer contexts in `presentation/context/`. There is no `src/lib/` (§4.8).

## 2. Domain and Use Cases

1. Models own entities, constants, normalizers and command/query value types; repositories import models only, never use cases. Every read and mutation has a focused use case and repository contract.
2. Each feature owns its models and DTOs even when data overlaps another feature's; never alias or re-export another feature's entity. App maps between them.
3. Validate mutations in domain (including whitespace-only names); UI hints and schemas do not replace it.
4. Payloads never carry `userId`; nullable updates keep tri-state semantics through domain inputs and DTOs.

## 3. Data and Composition

1. APIs take and return DTOs only. Request and response DTOs/schemas live in `<feature>/data/dtos`.
2. Mappers normalize (aliases, nulls, timestamps), validate the transport shape, then build domain objects. Axios/backend and schema failures are translated through `shared/data` before they reach ViewModels.
3. React Query keys, mutations, invalidation and cache updates stay in data repositories, scoped by authenticated identity. Query functions execute use cases. Presentation sees semantic data/loading/error, never TanStack types.
4. App composition binds repositories to use cases; App providers supply presentation-owned contexts; consumers never import `app/`. Presentation contracts may carry domain values to ViewModels, not to screens/components.
5. Provider order: QueryClient → ErrorBoundary → theme → auth/session → feature capabilities. Providers and hook/context definitions live in separate files (Fast Refresh). `App.tsx` and `main.tsx` stay thin.

## 4. Presentation and Shared UI

1. Screens/components render ViewState, primitives and `SelectOption`s, never domain entities/enums; editing uses IDs or ViewState. ViewModels own form state, validation feedback, loading and actions; presentation mappers use domain methods for domain decisions.
2. Derived display data (greetings, counts, lists) is computed in ViewModels/presentation mappers, not inline in screens. Cross-feature display data arrives through the consuming feature's App-injected context.
3. Feature-specific UI stays in `<feature>/presentation/components` even when several routes use it; shared `components/` stays feature-neutral.
4. Shared layout (navbar, shell) is prop-driven; App owns its state and callbacks and renders feature-owned dialogs. Never drive global navigation from a feature form ViewModel.
5. Split distinct render regions into controlled subcomponents; keep internals out of public barrels.
6. `SelectOption` belongs to `components/ui`; shared primitives never depend on feature types.
7. Only `components/ui` and `components/app` import vendored shadcn/ui primitives, radix-ui, lucide-react, sonner, cva/clsx/tailwind-merge and compose Tailwind classes. Their exported APIs are narrow and semantic (closed variant/tone/size unions, value callbacks): no library Props, `asChild`, className passthroughs or arbitrary spreads. Features and App compose those components only.
8. No `src/lib/`. `cn` lives in `components/ui/utils.ts`. Display copy (labels, status names) lives in the owning feature; App injects it into other features.
9. `components/app` holds only feature-neutral blocks with semantic props; a feature-specific block belongs to its feature.

## 5. Session, Network and Cross-Feature Synchronization

1. App injects token access, refresh, expiry and public-endpoint exclusions (owned by the auth feature) into generic networking. Capture token and session generation at request time, coalesce concurrent refreshes, retry once. A second 401 or a missing/failed/malformed refresh clears the whole session and notifies subscribers, with no page reload.
2. Hydration validates stored session values and clears corrupt or partial sessions. Storage keys and serialized format stay compatible; snapshots are cached for `useSyncExternalStore`. Refresh uses a separate non-intercepted transport.
3. Stale async results never win: generation/revision checks stop old requests, refreshes or reads from reviving a logged-out session, clearing a newer one, or overwriting newer data. Caches are cleared on signout/expiry.
4. Features interact only through consumer-owned contracts adapted and injected by App; never import another feature's repositories, mappers or ViewModels.

## 6. Module Folders, Barrels and Orphans

1. Module folders as in shared §7; non-feature roots are `app`, `foundation`, `shared`, `components`.
2. Cross-folder imports use the folder's `index.ts`; same-folder imports are relative; barrels export only public API.
3. No orphans except the entry `src/main.tsx` and `*.d.ts`.

## 7. Verification

- `npm test`, `npm run build`, `npm run lint`, `npm run check:architecture`, plus `git diff --check`. If client DTO/mapper paths or behavior change, also run the server suite (its contract test imports them).
- Tests use the Node test runner with Vite SSR, run sequentially, close each SSR loader and add no dependencies. Never change production Vite config for tests.
- `src` uses only packages in `dependencies`, never devDependencies; every import resolves. Comparison-screen code snippets are content, not imports.
