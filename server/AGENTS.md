# Server Agent Instructions (Express + SQLite)

Follow [server architecture rules](./.devin/rules/server-architecture.md), [shared rules](../.devin/rules/clean-architecture.md), and [root instructions](../AGENTS.md).

## 1. Organization and Phase Status

Building-block order is Foundation → Features → App; import direction is App → Features / Foundation. App binds features and injects their dependencies. Foundation never imports features or App. Within a feature: presentation → domain ← infrastructure.

S4 server acceptance is complete: security, profile and tasks own their layers alongside reusable foundation utilities and a minimal shared domain kernel. No legacy layer-first source roots remain. Empty legacy directories and stale generated dist output were removed with explicit user approval, then rebuilt. Manual import/DI/environment audits, compiled startup smoke tests and unchanged-client mapper compatibility tests pass. The client feature-first migration is also complete: security, profile, tasks, dashboard and comparison own their layers under `client/src/<feature>/` with App-injected cross-feature contracts. Stop for approval after each phase; finish all server phases before client phases.

```text
src/
├── app/
│   ├── config.ts              # Only environment reader
│   ├── container.ts           # DI, feature binding, seed hashing injection
│   └── createApp.ts           # Express middleware and route mounting
├── foundation/
│   ├── database/              # Connection, migrations, dependency-injected seed
│   ├── persistence/           # Generic UTC timestamp normalization
│   └── http/                  # Parsing, identity extraction, errors, logging
├── security/
│   ├── domain/{models,ports,useCases}/
│   ├── infrastructure/{persistence,repositories,security}/
│   └── presentation/{controllers,routes,schemas,mappers,middleware}/
├── profile/
│   ├── domain/{models,ports,useCases}/
│   ├── infrastructure/{persistence,repositories}/
│   └── presentation/{controllers,routes,schemas,mappers}/
├── tasks/
│   ├── domain/{models,ports,useCases}/
│   ├── infrastructure/{persistence,repositories}/
│   └── presentation/{controllers,routes,schemas,mappers}/
├── shared/domain/             # Errors, name and optional-text normalization
└── server.ts                  # Thin startup; awaits App-wired seed before listen
```

Server features are security, profile, and tasks. Do not create empty dashboard/comparison/components server modules. The users table remains shared storage, but domain contracts are separate:
- `security/domain/ports/AccountRepository.ts`: create accounts, find credentials by email, and find narrow identity by ID. Refresh consumes only the identity lookup capability. Password/email policy belongs to `security/domain/models/Account.ts`; shared name normalization belongs to `shared/domain/normalizeUserName.ts`.
- `profile/domain/ports/ProfileRepository.ts`: profile reads and updates only, never credential lookup or account creation. Profile change/input types live in `profile/domain/models/Profile.ts`.
- Security owns `SessionAccount`, account/credential rows and auth response mapping; profile owns `Profile`, profile rows and profile response mapping. Do not introduce cross-feature entity/DTO imports to avoid small explicit mapping duplication. Auth JSON still uses the public `user` field; profile routes stay mounted at `/api/users`.
- App constructs `SqliteAccountRepository` and `SqliteProfileRepository` with the same database and injects security authentication middleware into profile/task routes. There are no new endpoints or schema changes.

## 2. Change Workflow

1. Start in `<feature>/domain/models/`, then ports and single-operation use cases. Ports import owned models/shared domain only, never use cases.
2. Update feature persistence row mappers and repositories; inject generic foundation capabilities. Keep database types/SQL/driver errors out of domain and HTTP presentation.
3. Update feature request schemas, response DTOs, mappers, controllers and routes. Read/write operations always go through use cases and ports.
4. Wire concrete adapters, use cases, controllers, routers and cross-feature capabilities only in `app/container.ts`. Mount routes in `app/createApp.ts`. Do not put DI in foundation.
5. Update these instructions and the shared/server rules alongside each migration. Explicitly distinguish remaining legacy paths from target paths; leave client instructions unchanged until client phases.

## 3. Remediation Recipes

- **Cross-feature helper import:** shared optional-text semantics belong in `shared/domain/normalizeOptionalText.ts`; generic SQLite UTC conversion belongs in `foundation/persistence/normalizeSqliteTimestamp.ts`. Neither profile nor foundation may import task internals to reuse helpers.
- **Reverse dependencies:** feature domain must not import foundation, App, presentation, infrastructure, Express, Zod, SQLite, crypto adapters, or environment/browser APIs. Foundation must not import a feature model, mapper, repository, security adapter, or App configuration.
- **Bypassed ports:** add read/write contracts and focused use cases, then inject implementations from App. Do not call repositories directly from controllers or construct adapters in route modules.
- **Missing normalization:** task constants/title normalization live in `tasks/domain/models/Task.ts`; shared optional-text normalization preserves undefined/null/non-empty states. Both registration and profile updates use shared name normalization; security owns email normalization and the existing six-character registration password policy. Normalize and validate required mutations before calling ports; preserve login's invalid-credentials behavior rather than introducing a new response policy during structural migration.
- **Token confusion:** keep access/refresh claims distinct and translate JWT failures to `UnauthorizedError` inside `security/infrastructure/security/JwtTokenService.ts`. Refresh verifies token type before querying account identity, rejects missing accounts, and issues the new access token from the current stored identity rather than stale token data.
- **Unable to clear fields:** task/profile changes accept `string | null | undefined`; preserve null in HTTP schemas. SQL distinguishes omitted fields from explicit NULL, rather than using COALESCE for clearable columns.
- **Corrupt persistence enums:** `tasks/infrastructure/persistence/TaskRow.ts` rejects unknown statuses/priorities instead of inventing defaults. Treat stored corruption as an unexpected server failure, not a client ValidationError. Valid creation defaults are still domain-owned.
- **Timestamp mapping:** both task and user row mappers use the foundation UTC utility; never import one feature's mapper from another.
- **Weak DTOs/errors:** use domain literal types for task response enums. Translate database uniqueness to `ConflictError`; HTTP middleware maps domain errors to statuses and sanitizes unexpected failures.
- **Seed coupling:** `foundation/database/seed.ts` takes a database and async hashing callback. App supplies the configured hasher; foundation imports no feature adapters, and bootstrap awaits completion before listening. Do not seed at import time.
- **Configuration:** only `app/config.ts` reads environment values and rejects missing/default production JWT secrets. Keep inline SQL out of App.

## 4. Verification and Test Safety

```bash
cd server
npm run build
npm test
npm run test:startup
```

Also run `git diff --check` from the repository root. `npm test` first runs `npm run test:typecheck`, then executes `tests/*.test.ts` with the existing tsx and Node test runner. Do not import `src/server.ts` in tests, since it starts the persistent application.

Each HTTP test uses an independent `:memory:` database and ephemeral loopback listener, with cleanup hooks. Tests run migrations; only explicit seed tests seed their disposable database. Never substitute persistent database paths or ambient environment configuration. Tests cover auth/profile/task contracts and ownership, token separation/expiry, nullable updates, domain normalization, UTC mapping, stored-enum rejection, error sanitization, production configuration and seed injection/idempotence. Narrow-port/shared-table regressions also verify independent account/profile capabilities, credential-free response whitelists, login snapshots after profile edits, missing-account handling, and refresh signing from current stored identity. Feature integration tests may construct adapters directly; production DI remains exclusively in App.

`tests/client-contract.test.ts` sends current client request DTOs to disposable server endpoints and validates responses with the actual client schemas/domain mappers. Install both applications' dependencies before running the full suite; this is test-only coupling, not a production server dependency. Update those test import paths as client features migrate.

`npm run test:startup` builds/typechecks, then runs `tests/startup.smoke.ts` against the real compiled `dist/server.js` entry in child processes. It checks migration/seed ordering, demo login, protected tasks, CORS preflight and rejection of missing/default production signing keys before database initialization. Each child gets an explicit isolated environment, DB_PATH=:memory:, dotenv pointed at the platform null device, and an ephemeral port; cleanup stops the child. Never run a startup smoke test with the user's stored database or ambient dotenv file.

The TypeScript build does not remove obsolete output after source moves. Inventory stale generated files, obtain specific approval before deleting old output, then rebuild and run startup smoke tests. Do not introduce an automatic destructive clean into build scripts without approval. The S4 fresh-build inventory contains only app/foundation/security/profile/tasks/shared plus compiled entry artifacts.

The S4 unchanged-client gate passed with pre-existing bundle-size and mixed AuthContext export warnings. Approved C1 App/provider separation removed the lint warning; the C2 build also emits no large-chunk warning. Client source/config/instructions were not changed during server phases; track current client status in client/AGENTS.md.

Architecture checks remain deferred by user decision: installed TypeScript 7 lacks the compiler parser API and a separate parser dependency was declined. There is no `check:architecture` script. Manually audit import boundaries; passing builds/tests do not establish architectural correctness.
