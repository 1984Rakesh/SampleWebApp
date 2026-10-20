# Client Agent Instructions (React)

Follow [client rules](./.devin/rules/client-architecture.md), [shared rules](../.devin/rules/clean-architecture.md) and [root instructions](../AGENTS.md).

## 1. Organization and Checkpoint

Building blocks: Foundation → Features → App. Imports: App → Features / Foundation. Within features: presentation → domain ← data. App owns DI, provider/router/shell integration and cross-feature mapping; foundation never imports features or App.

**C2 security/profile/session migration is complete; C3–C5 are pending.** Server phases and C1 App/shared-UI groundwork are complete. Tasks/dashboard/comparison remain in legacy layer-first locations until their approved phases. Stop for approval after every phase.

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
├── foundation/{network,session,theme}/
├── shared/
│   ├── domain/            # Framework-free errors/common normalization
│   └── data/              # Common boundary error translation, never domain policy
├── components/{ui,feedback,layout}/
├── domain/                # Remaining task domain only
├── data/                  # Remaining task transport/cache adapters only
├── presentation/          # Remaining task/dashboard/comparison UI and injected task/profile-summary contracts
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
- Profile's consumer-owned context accepts display-only task counts supplied by App, not task models/repositories/ViewModels. Legacy dashboard consumes an App-supplied profile-name/loading capability rather than security/profile ViewModels; its remaining task ViewModel composition is C4 scope. Legacy context files contain no migrated feature contracts.
- Shared Navbar receives ViewState and callbacks; App owns drawer/task-dialog state and renders the tasks-owned dialog (still legacy presentation until C3). Keep AppProviders order QueryClient → ErrorBoundary → theme → auth → injected feature capabilities. App.tsx remains thin.

## 3. Remediation Recipes

- **Reverse/upward imports:** domain imports only owned models/contracts/shared domain. No React, Axios, Zod, storage/browser APIs, foundation or App. Feature data/presentation do not import sibling implementations. Define consumer-owned capabilities and adapt/inject them in App.
- **Read bypasses a use case:** add an owned query/model and repository contract, execute the use case inside the reactive data adapter, and expose narrow data/loading/error state without TanStack types in presentation contracts.
- **Raw transport/schema failures:** APIs/mappers translate through shared/data/translateError into domain/application errors, preserving backend error messages. Foundation emits generic HttpError, never domain-specific auth policy. Do not duplicate contradictory domain validation or add catch-and-rethrow blocks with no translation.
- **Nullable profile updates:** UpdateProfileInput and UpdateProfileDTO support string/null/undefined for bio/avatar. Domain normalizes whitespace/empty to null, omission stays undefined; request mapping preserves both. Name/email normalization remains authoritative in shared domain; registration minimum password length is six, while signin preserves existing required-password behavior.
- **Domain leaks in UI:** screens/components render ViewState/primitives/options, not domain entities/enums. ViewModels own form state/validation/actions; presentation mappers use domain methods for domain decisions. Profile form components remain controlled.
- **Mixed render regions:** split feature render regions into controlled subcomponents, retaining only shared local UI orchestration in entry components. Do not export internal pieces from broad barrels. Badge/CodeBlock/task cards remain legacy feature UI pending C3/C4, not shared UI by default.
- **MUI/UI coupling:** @mui only in components/ui and foundation/theme. No sx/component/MUI Props/passthrough leakage. Shared components import no business/domain/data/App modules. SelectOption is owned by components/ui. Add missing sealed primitives instead of importing MUI elsewhere.
- **Legacy task debt:** do not re-export migrated auth/profile types from task domain/data barrels or introduce compatibility shims. Task nullable-input/error refinements remain C3 scope; comparison example strings are C4 content, not executable dependencies.

## 4. Verification

```bash
cd client
npm test
npm run build
npm run lint
```

Run repository git diff --check. Update server/tests/client-contract.test.ts import paths when client DTOs/mappers move; run server npm test and npm run test:startup for the cross-app gate. APIs, browser routes, ownership rules, database schema and stored-session compatibility must remain unchanged.

Tests use Node plus existing Vite SSR/React rendering and Axios adapters; no new dependencies. Test files run sequentially (--test-concurrency=1) to avoid Vite SSR websocket-port conflicts. Close each SSR loader. Tests exercise navbar/provider/guard behavior, validated persistence and reactive subscriptions, auth exclusions, coalesced refresh, expiry, malformed responses, logout races, profile synchronization/ordering, tri-state patches and boundary errors. They are not full browser layout/portal/click tests.

Manually inspect imports for pure domains, isolated features, foundation independence, MUI allowlists and no ViewModel App/data imports. Comparison snippets can contain old example imports; update them during C4, not as runtime violations. AST architecture tooling remains deferred by user decision; do not add a parser dependency or claim a check:architecture script exists.
