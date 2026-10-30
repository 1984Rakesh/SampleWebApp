---
name: client-architecture
description: React client clean-architecture rules (layer table, domain, data/React Query, presentation and shadcn UI boundary, session sync, verification). Use before changing code under client/; read the shared clean-architecture skill too when a change crosses a boundary.
---

# Client Clean Architecture Rules (React)

Extend the [shared rules](../clean-architecture/SKILL.md). Inside a feature: Presentation → Domain ← Data. The dependency-cruiser config cites these section numbers (client §n); keep them stable.

## 1. Module and Layer Dependencies

| Module | Allowed | Forbidden |
| :--- | :--- | :--- |
| Domain | Own models/repositories/use cases, `shared/domain` | App, foundation, outer layers, frameworks, browser APIs |
| Data | Own domain/data, generic foundation transport, `shared/data` | App, presentation, sibling features |
| Presentation ViewModels/mappers | Own domain/presentation, injected consumer contracts, generic foundation hooks | App, data implementations, Axios/Zod/React Query |
| Screens/feature components | ViewState, options, callbacks, own presentation, shared UI, shadcn primitives/`cn` from the `components/ui` barrel, lucide-react, sonner (§4.7) | Domain entities/enums, App/data, primitive files, radix-ui/cva/clsx/tailwind-merge |
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
4. `userId` and tri-state patches: shared §2, §5.

## 3. Data and Composition

1. APIs take and return DTOs only. Request and response DTOs/schemas live in `<feature>/data/dtos`.
2. Mappers normalize (aliases, nulls, timestamps), validate the transport shape, then build domain objects. Axios/backend and schema failures are translated through `shared/data` before they reach ViewModels.
3. React Query keys, mutations, invalidation and cache updates stay in data repositories, scoped by authenticated identity. Query functions execute use cases. Presentation sees semantic data/loading/error, never TanStack types.
4. (Legacy until the shared §8 migration; new code follows shared §10–§11.) App composition binds repositories to use cases; App providers supply presentation-owned contexts; consumers never import `app/`. Presentation contracts may carry domain values to ViewModels, not to screens/components.
5. Provider order: QueryClient → ErrorBoundary → theme → auth/session → feature capabilities. Providers and hook/context definitions live in separate files (Fast Refresh). `App.tsx` and `main.tsx` stay thin.

## 4. Presentation and Shared UI

1. Screens/components render ViewState, primitives and `SelectOption`s, never domain entities/enums; editing uses IDs or ViewState. ViewModels own form state, validation feedback, loading and actions; presentation mappers use domain methods for domain decisions.
2. Derived display data (greetings, counts, lists) is computed in ViewModels/presentation mappers, not inline in screens. Cross-feature display data arrives through the consuming feature's App-injected context.
3. Feature-specific UI stays in `<feature>/presentation/components` even when several routes use it; shared `components/` stays feature-neutral.
4. Shared layout (navbar, shell) is prop-driven; App owns its state and callbacks and renders feature-owned dialogs. Never drive global navigation from a feature form ViewModel. Target model: features own internal routes and App only links features (shared §9); current App-owned routing is a known violation (shared §8).
5. Split distinct render regions into controlled subcomponents; keep internals out of public barrels.
6. `SelectOption` belongs to `components/ui`; shared primitives never depend on feature types.
7. Feature `presentation/screens|components`, `components/layout|feedback`, `src/app/` and `App.tsx` use shadcn/ui directly: they import primitives and `cn` from the `components/ui` barrel (never `components/ui/<file>.tsx`), icons from lucide-react and toasts from sonner, and compose Tailwind token utilities. Primitives are generated into `components/ui` and styled there per the Tasks App DS in `client/docs/design-system/`. radix-ui, cva, clsx and tailwind-merge stay private to `components/ui` and `components/app`. ViewModels, presentation models, hooks, contexts, domain, data, foundation and shared stay UI-library free.
8. No `src/lib/`. `cn` lives in `components/ui/utils.ts`; the consumers in §4.7 import it from the `components/ui` barrel. Display copy (labels, status names) lives in the owning feature; App injects it into other features.
9. `components/app` holds only feature-neutral blocks with semantic props; a feature-specific block belongs to its feature.

## 5. Session, Network and Cross-Feature Synchronization

1. App injects token access, refresh, expiry and public-endpoint exclusions (owned by the auth feature) into generic networking. Capture token and session generation at request time, coalesce concurrent refreshes, retry once. A second 401 or a missing/failed/malformed refresh clears the whole session and notifies subscribers, with no page reload.
2. Hydration validates stored session values and clears corrupt or partial sessions. Storage keys and serialized format stay compatible; snapshots are cached for `useSyncExternalStore`. Refresh uses a separate non-intercepted transport.
3. Stale async results never win: generation/revision checks stop old requests, refreshes or reads from reviving a logged-out session, clearing a newer one, or overwriting newer data. Caches are cleared on signout/expiry.
4. Features interact only through consumer-owned contracts adapted and injected by App; never import another feature's repositories, mappers or ViewModels.

## 6. Module Folders, Barrels and Orphans

1. Module folders as in shared §7; non-feature roots are `app`, `foundation`, `shared`, `components`.
2. Barrels as in shared §7.
3. No orphans except the entry `src/main.tsx` and `*.d.ts`.

## 7. Verification

- `npm test`, `npm run build`, `npm run lint`, `npm run check:architecture`, plus `git diff --check`. If client DTO/mapper paths or behavior change, also run the server suite (its contract test imports them).
- Tests use the Node test runner with Vite SSR, run sequentially, close each SSR loader and add no dependencies. Never change production Vite config for tests.
- `src` uses only packages in `dependencies`, never devDependencies; every import resolves. Comparison-screen code snippets are content, not imports.
