---
description: "React client clean architecture rules"
trigger: always_on
---

# Client Clean Architecture Rules (React)

These extend [shared rules](../../../.devin/rules/clean-architecture.md). See [client agent instructions](../../AGENTS.md) for the current tree, remediation recipes and verification.

## 1. Module and Layer Dependencies

```text
Building blocks: Foundation → Features → App
Imports: App → Features / Foundation
Inside features: Presentation → Domain ← Data
```

App owns composition, provider/router/shell integration and cross-feature adaptation. Foundation owns reusable capabilities, not DI or feature policy. Features/shared components never import App. Feature domains never import foundation, React, React Query, Axios, Zod, UI component libraries, browser APIs or data/presentation implementations.

The feature-first layout is in place. Foundation exposes generic network/storage/theme capabilities only. Dashboard and comparison are presentation-only features (no artificial domain/data layers). Each feature owns its consumer contexts; App injects cross-feature capabilities (`DashboardCapabilities`, profile task-counts) rather than allowing sibling imports. There is no `src/lib/`; see §4.8.

| Module | Allowed dependencies | Forbidden dependencies |
| :--- | :--- | :--- |
| Domain | Own models/repositories/use cases; minimal shared domain when introduced | App, foundation, outer layers, frameworks, browser APIs |
| Data | Own domain/data; generic foundation transport | App, presentation, sibling feature internals |
| Presentation ViewModels/mappers | Own domain/presentation; injected consumer contracts; generic foundation hooks | App, concrete data adapters, Axios/Zod/React Query |
| Screens/feature components | ViewState, options, controlled callbacks, own presentation, shared UI | Domain entities/enums, App/data internals, vendored UI primitives |
| Shared components | Own UI contracts/components and generic theme capability | App, business models, feature components/hooks, data adapters |
| Foundation | Generic capabilities and permitted libraries | App, feature implementations, business policy |
| App | All layers for binding/provider/route/shell integration | Business invariants, duplicate domain validation |

Foundation has no feature/App/domain-model dependencies: network receives callbacks and emits generic HttpError; session provides KeyValueStorage/browser mechanics. Security's BrowserSessionRepository owns persisted account validation and session meaning. App alone configures transports, adapters and feature integration. Shared/data contains common outer-boundary error translation, not shared domain policy; it may depend on generic transport errors and Zod, while shared/domain stays framework-free.

## 2. Domain and Use Cases

1. Keep domain pure TypeScript. Models own entities, constants, normalizers, command/query value types; repositories import models only, never use cases. Every read/mutation has a focused use case and repository contract.
2. Security owns Account/AuthSession, AuthRepository (login/register/refreshToken), SessionRepository and focused login/register/refresh/signout use cases. Profile owns Profile/ProfileModel, nullable UpdateProfileInput, ProfileRepository (getCurrentUser/updateProfile) and focused read/update use cases. App maps account/profile representations explicitly; never alias entities or share feature DTOs. The remaining task contract covers getTasks/createTask/updateTask/deleteTask/toggleTaskStatus. No new backend logout endpoint.
3. Required-text/email/password/enum invariants belong in domain. Normalize before validating, do not fabricate required IDs/ownership/status, and validate mutations including whitespace-only task/profile names. UI hints/structural schemas do not replace domain validation.
4. Ownership comes from the verified server session. Client mutation inputs/payloads must not send userId. Nullable updates must distinguish omitted/undefined, explicit null/normalized empty, and non-empty values; preserve these across DTO mapping and domain inputs.

## 3. Data and Composition

1. APIs consume/return DTOs, never domain entities/use-case inputs. Keep distinct request/response DTOs and schemas in the owning feature data layer (`<feature>/data/dtos`).
2. Mappers normalize nullable/legacy aliases (due_date/user_id/created_at/updated_at), validate transport shapes, then construct domain objects. Translate Axios/backend `{ error: string }` and Zod failures before they reach ViewModels.
3. React Query keys, filter identity, mutations, invalidation and profile-cache updates stay in data repositories. Profile cache keys include authenticated identity; auth data never writes profile entities into cache. App maps/explicitly seeds profile values after login and binds profile responses to the active session. Reject results from an obsolete login and prevent pre-update reads/earlier mutations from overwriting newer snapshots/cache results. Read query functions execute domain use cases. Expose semantic data/loading/error capabilities, never TanStack types.
4. App composition binds concrete repositories to use cases. App/providers supplies presentation-owned contexts; consumers never import app/composition. Presentation contracts may contain domain values for ViewModels, not for screens/components. Consumer contracts are owned by the consuming feature.
5. App provider order is QueryClient, ErrorBoundary, theme, auth/session integration, feature capabilities. Auth provider and hook/context definitions remain separate so component modules support Fast Refresh. App.tsx is a thin entry.

## 4. Presentation and Shared UI

1. Screens/components render ViewState primitives and SelectOption arrays, not raw Task/Account/Profile entities or domain enums. Editing uses IDs or ViewState. ViewModels own form state, validation feedback, loading and actions. Presentation mappers use domain methods for domain decisions.
2. Derive dashboard greeting/counts/recent tasks in presentation adapters/ViewModels, not inline screens. Dashboard receives profile name/loading and display-ready task items/counts/toggle through its own App-injected `DashboardCapabilities` context, not security/profile/tasks internals. Profile receives display-only task counts through its own consumer context; it must never import task internals.
3. Feature-specific dialogs/cards/forms live in their owning feature's presentation components (`<feature>/presentation/components`); shared UI lives in components. Do not move task/profile-specific code into shared components merely because multiple routes use it.
4. Shared Navbar is a thin prop-driven orchestrator with toolbar/drawer regions under components/layout/navbar. AppNavbar owns session/theme/navigation callbacks, drawer/create-dialog state and the feature-owned TaskDialog. Never use the auth form ViewModel to render global navigation.
5. Decompose distinct render regions into controlled feature subcomponents; entry components own shared local UI state and branch/callback wiring. Keep internal pieces out of broad public barrels.
6. SelectOption belongs to components/ui/SelectOption.ts; feature presentation types must not become dependencies of shared primitives.
7. Only components/ui (and generic blocks in components/app) may import vendored shadcn/ui primitives, radix-ui, lucide-react icons and compose Tailwind token utilities. Wrapper APIs remain narrow/semantic: closed variant/tone/size unions, layout-intent props and value-based callbacks. Never expose Radix/shadcn Props, `asChild`, class-name passthroughs or arbitrary spreads. Internal primitive props/classes are allowed only inside that boundary. App and feature UI compose Ui primitives exclusively.
8. There is no `src/lib/`. The `cn` class-composition helper lives in `components/ui/utils.ts`. Feature display copy (labels, status names) lives in the owning feature's presentation layer; App injects it into other features through their consumer-owned contracts, never by a cross-feature or shared-folder import.
9. `components/app/` holds only feature-neutral blocks with semantic props. Never add feature-named blocks there (e.g. no TaskRow); a feature-specific block belongs to its feature, or becomes a neutral block (e.g. a checklist row with `title`/`meta`/`checked`/`chips`/`onToggle`) that the feature maps its ViewState onto.

## 5. Session, Network and Cross-Feature Synchronization

1. App injects security-owned auth endpoint exclusions (/auth/login, /auth/register, /auth/refresh), token/version access, refresh and expiry into generic networking. Wrong credentials reach ViewModels intact. Capture token/generation synchronously; coalesce concurrent protected 401 refreshes; retry once. A second 401, absent refresh token, malformed refresh or refresh failure expires the full session and notifies consumers without a forced page reload.
2. BrowserSessionRepository validates stored account/token values and clears corrupt/partial sessions. Preserve accessToken/refreshToken/user keys and compatible JSON; snapshots must be cached for useSyncExternalStore. Authentication-generation checks prevent old requests/refreshes from reviving logout state, retrying as a different login or clearing a newer session. Refresh uses a separate non-intercepted transport supplied by App.
3. App coordinates profile/session/cache representations through explicit boundary mappings and ownership/generation checks. Profile mutation revisions protect newer state from stale read/update results. AuthProvider reacts to session notifications and clears cache on signout/expiry. Generic foundation never imports App or feature implementations.
4. Feature-to-feature interaction is through consumer-owned contracts adapted/injected by App. Do not import another feature's concrete repositories, DTO mappers or ViewModels.

## 6. Module Folders, Barrels and Orphans

1. A module folder is `<feature>/<layer>/<sub>/` (e.g. `tasks/domain/models/`). For `app`, `foundation`, `shared` and `components` it is `<root>/<sub>/` (e.g. `components/ui/`).
2. Imports from outside a module folder must go through that folder's `index.ts`. Imports inside the same module folder use relative paths. Barrels export only the folder's public API; internal pieces stay unexported.
3. No orphan source files. The only exceptions are the entry `src/main.tsx` and `*.d.ts` files.

## 7. Verification

Run npm test, npm run build, npm run lint and npm run check:architecture in client, plus repository git diff --check. Tests use Node, existing Vite SSR and React rendering without adding dependencies; they verify controlled UI/capability/provider/session/guard behavior, not browser layout or portal interaction. Keep production Vite configuration unchanged by test-only SSR options. Manually audit executable import paths (embedded comparison snippets are content, not module dependencies). Run the server compatibility tests when shared contract paths/behavior change. Boundaries are enforced by dependency-cruiser (`client/.dependency-cruiser.cjs`) via `npm run check:architecture`; every rule is error-level. Never weaken or ignore a rule to make it pass. Prop leakage, ViewState versus entity rendering, tri-state patches and error translation remain manual-review items.
