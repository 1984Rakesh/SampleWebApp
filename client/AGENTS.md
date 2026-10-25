# Client Agent Instructions (React)

Follow [client rules](./.devin/rules/client-architecture.md), [shared rules](../.devin/rules/clean-architecture.md) and [root instructions](../AGENTS.md).

## 1. Organization

Building blocks: Foundation → Features → App. Imports: App → Features / Foundation. Within features: presentation → domain ← data. App owns DI, provider/router/shell integration and cross-feature mapping; foundation never imports features or App.

The feature-first layout is in place. Cross-feature capabilities are consumer-owned contracts injected by App.

```text
src/
├── app/
│   ├── composition/       # Runtime construction, explicit profile/session mapping, UI capability adapters
│   ├── providers/         # Query/theme/auth/feature provider integration
│   └── router/            # Routes/guards/shell under unchanged browser paths
├── security/
│   ├── domain/{models,repositories,useCases}/
│   ├── data/{api,dtos,mappers,repositories}/
│   └── presentation/{context,hooks,screens}/
├── profile/
│   ├── domain/{models,repositories,useCases}/
│   ├── data/{api,dtos,mappers,repositories}/
│   └── presentation/{context,models,hooks,screens,components}/
├── tasks/
│   ├── domain/{models,repositories,useCases}/
│   ├── data/{api,dtos,mappers,repositories}/
│   └── presentation/{context,models,hooks,screens,components}/
├── dashboard/
│   └── presentation/{context,models,hooks,screens,components}/
├── comparison/
│   └── presentation/{models,hooks,screens,components}/
├── foundation/{network,session,theme}/
├── shared/
│   ├── domain/            # Framework-free errors/common normalization
│   └── data/              # Common boundary error translation, never domain policy
├── components/{ui,app,feedback,layout}/   # ui/utils.ts holds the cn helper; no src/lib/
├── App.tsx
└── main.tsx
```

Security Account/AuthSession and Profile/ProfileModel are independent domain representations; do not alias/re-export one as the other or share DTO schemas across features. App maps their fields explicitly. Domain repositories import only owned models, never use cases. Shared domain contains no feature entities, frameworks or transport types.

## 2. Composition, Session and Network

- `app/composition/securityRuntime.ts` constructs the session and HTTP auth adapters, configures the generic client, and supplies a separate non-intercepted refresh transport. Only App binds concrete feature repositories/use cases. Foundation contains no feature model, mapper, context or callback imports.
- Security owns login/register/refresh/signout policy, DTOs/schemas, account validation and `BrowserSessionRepository`. Foundation/session provides only KeyValueStorage/browser mechanics. Security's repository preserves localStorage keys accessToken/refreshToken/user and compatible serialized user fields. Hydration validates, clears corrupted/partial sessions, and caches snapshots for useSyncExternalStore.
- App AuthProvider subscribes to the session port, clears query caches on expiry/signout, and supplies the security-owned session context. Auth form ViewModels receive security-owned use-case capabilities. Global Navbar reads the session context, not an auth form ViewModel. Routes/providers remain App-owned; feature consumers never import App.
- Generic networking receives token/version/refresh/expiry/public-request callbacks from App. Security owns auth endpoint exclusions. Capture tokens/session generation synchronously, coalesce concurrent refreshes, retry protected requests once, and expire a second 401. Do not let old responses/refreshes revive a logged-out session or clear a newer login. Missing/failed/malformed refresh clears the entire session and notifies reactive subscribers; no forced window.location reload.
- `app/composition/profileSession.ts` maps account/profile models and binds profile reads/updates to the active session. Check authentication generation and returned ownership. A read or earlier mutation must not overwrite newer profile results; obsolete responses return the current validated snapshot. Never import security into profile or vice versa.
- Profile cache keys and updates live in its React Query adapter, scoped by identity. Auth data does not write profile cache entries. App explicitly seeds mapped profile values after login and coordinates profile-to-session updates. Domain reads still go through GetCurrentUserUseCase and repository contracts.
- Profile's consumer-owned context accepts display-only task counts supplied by App, not task models/repositories/ViewModels. Dashboard consumes an App-injected `DashboardCapabilities` context (profile name/loading plus display-ready task items/counts/toggle), never task or profile internals. Each feature owns its consumer contexts; no shared cross-feature context remains.
- Shared Navbar receives ViewState and callbacks; App owns drawer/task-dialog state and renders the tasks-owned dialog. Keep AppProviders order QueryClient → ErrorBoundary → theme → auth → injected feature capabilities. App.tsx remains thin.

## 3. Remediation Recipes

- **Reverse/upward imports:** domain imports only owned models/contracts/shared domain. No React, Axios, Zod, storage/browser APIs, foundation or App. Feature data/presentation do not import sibling implementations. Define consumer-owned capabilities and adapt/inject them in App.
- **Read bypasses a use case:** add an owned query/model and repository contract, execute the use case inside the reactive data adapter, and expose narrow data/loading/error state without TanStack types in presentation contracts.
- **Raw transport/schema failures:** APIs/mappers translate through shared/data/translateError into domain/application errors, preserving backend error messages. Foundation emits generic HttpError, never domain-specific auth policy. Do not duplicate contradictory domain validation or add catch-and-rethrow blocks with no translation.
- **Nullable profile updates:** UpdateProfileInput and UpdateProfileDTO support string/null/undefined for bio/avatar. Domain normalizes whitespace/empty to null, omission stays undefined; request mapping preserves both. Name/email normalization remains authoritative in shared domain; registration minimum password length is six, while signin preserves existing required-password behavior.
- **Domain leaks in UI:** screens/components render ViewState/primitives/options, not domain entities/enums. ViewModels own form state/validation/actions; presentation mappers use domain methods for domain decisions. Profile form components remain controlled.
- **Mixed render regions:** split feature render regions into controlled subcomponents, retaining only shared local UI orchestration in entry components. Do not export internal pieces from broad barrels. Badge lives in tasks, CodeBlock/LayerMap/ComparisonPanel in comparison — feature-specific UI is not shared UI by default.
- **Component-library coupling:** vendored shadcn/ui primitives, radix-ui, lucide-react and Tailwind composition only inside components/ui and components/app. No Radix/shadcn Props, asChild or class-passthrough leakage. Shared components import no business/domain/data/App modules. SelectOption is owned by components/ui. Add missing sealed primitives instead of importing component-library internals elsewhere.
- **Shared helpers and display copy:** there is no `src/lib/`. The `cn` helper lives in `components/ui/utils.ts`. Feature display copy (e.g. task status labels) lives in the owning feature; App injects it into other features through their consumer-owned contracts.
- **Feature-named shared blocks:** `components/app/` holds only feature-neutral blocks with semantic props (e.g. `title`, `meta`, `checked`, `chips`, `onToggle`), never feature-named ones such as TaskRow. Task-specific UI belongs in the owning feature.
- **Deep imports and orphans:** import another module folder only through its `index.ts`; use relative paths inside a folder; export only public API. Delete or wire up orphan files (entries `main.tsx` and `*.d.ts` excepted).
- **Feature barrels:** do not re-export another feature's types from feature barrels or introduce compatibility shims between features. Task nullable `description`/`dueDate` inputs carry `string | null | undefined` cleanly to the DTO boundary; comparison example strings are content, not executable dependencies.

## 4. Verification

```bash
cd client
npm test
npm run build
npm run lint
npm run check:architecture
```

Run repository git diff --check. Update server/tests/client-contract.test.ts import paths when client DTOs/mappers move; run server npm test and npm run test:startup for the cross-app gate. APIs, browser routes, ownership rules, database schema and stored-session compatibility must remain unchanged.

Tests use Node plus existing Vite SSR/React rendering and Axios adapters; no new dependencies. Test files run sequentially (--test-concurrency=1) to avoid Vite SSR websocket-port conflicts. Close each SSR loader. Tests exercise navbar/provider/guard behavior, validated persistence and reactive subscriptions, auth exclusions, coalesced refresh, expiry, malformed responses, logout races, profile synchronization/ordering, tri-state patches and boundary errors. They are not full browser layout/portal/click tests.

Manually inspect imports for pure domains, isolated features, foundation independence, component-library allowlists and no ViewModel App/data imports. Comparison snippets are template-string content describing the feature-first layout, not runtime imports. Boundaries are enforced by dependency-cruiser (`client/.dependency-cruiser.cjs`) via `npm run check:architecture`. Rules are error-level; never weaken or ignore a rule to make it pass. Prop leakage, ViewState versus entity rendering, tri-state patches and error translation remain manual-review items.
