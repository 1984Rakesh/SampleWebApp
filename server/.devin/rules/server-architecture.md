---
description: "Express server clean architecture rules"
trigger: always_on
---

# Server Clean Architecture Rules (Express + SQLite)

These extend the [shared rules](../../../.devin/rules/clean-architecture.md). See [server agent instructions](../../AGENTS.md) for the current tree and verification commands.

## 1. Module and Layer Dependencies

```text
App → Features / Foundation
Feature presentation → Feature domain ← Feature infrastructure
```

App is the composition tier, not part of foundation. Foundation exposes reusable technical capabilities and never imports App or features. Shared domain contains only framework-free common errors/value rules. Feature domains never import foundation.

The feature-first layout is in place: server business code lives in `src/security/`, `src/profile/` and `src/tasks/`, supported by `src/foundation/` and `src/shared/domain/`. Do not recreate top-level domain/infrastructure/presentation roots or add artificial client-only counterparts.

| Module | Allowed internal dependencies | Forbidden dependencies |
| :--- | :--- | :--- |
| Feature domain | Own models/ports/use cases, minimal shared domain | Other feature internals, foundation, App, infrastructure/presentation, Express, Zod, crypto/SQLite adapters, Node/browser/environment APIs |
| Feature infrastructure | Own domain/infrastructure, generic foundation capabilities, shared domain | Other feature internals, presentation, App, Express, Zod, process.env |
| Feature presentation | Own domain/presentation, generic foundation HTTP helpers, shared domain | Other feature internals, infrastructure, App, SQLite/bcrypt/JWT adapters, process.env |
| Foundation | Own generic modules, shared domain, appropriate technical libraries | Feature or legacy business models/ports/adapters, App, business policy, process.env |
| Shared domain | Shared domain only | Frameworks, foundation, App, feature models |
| App / bootstrap | All layers for composition | Business rules, inline SQL, unvalidated request handling |

Cross-feature capabilities use consumer-owned ports injected in App; do not import sibling implementations or use App as a service locator. Account creation/credential lookup/refresh identity belong to security's AccountRepository; profile reads/updates belong to ProfileRepository. Both SQLite adapters receive the same database from App without importing one another.

## 2. Domain Rules

1. `tasks/domain/models/Task.ts` owns task status/priority constants, creation defaults, model/filter/change types and title normalization. `shared/domain/normalizeOptionalText.ts` owns the proven common undefined/null/trimmed-string semantics. Errors live in `shared/domain/errors.ts`.
2. Shared `shared/domain/normalizeUserName.ts` is used by registration and profile updates. Security's `domain/models/Account.ts` owns email normalization and the existing six-character registration password policy. Security's Auth model owns login/register input types, tokens and auth results. Profile's `domain/models/Profile.ts` owns profile/update types; no credential or token types belong there. Do not share a universal User entity.
3. Use cases are constructor-injected `<Operation>UseCase` classes with a single public `execute` operation. Both reads and writes use ports; ports import models, never use cases. Validate business invariants before calling adapters; outer Zod parsing is structural, not a substitute for domain validation.
4. Registration normalizes name/email and validates password before calling ports; login normalizes email and verifies credentials without changing its existing invalid-credentials response policy. Refresh verifies a refresh token, then consumes only `findIdentityById` from AccountRepository and signs the current stored identity. Missing accounts are unauthorized. Do not catch only to rethrow adapter-translated errors.
5. Task changes and profile changes support `string | null | undefined` for nullable fields: omission preserves, null/normalized empty clears, non-empty updates. Never fabricate missing identity, ownership, status or other required persisted values.

## 3. Infrastructure and Foundation

1. Each feature's `infrastructure/persistence/` owns snake_case row contracts and explicit mapping. Security owns AccountRow/AccountCredentialsRow/AccountIdentityRow; profile owns ProfileRow; tasks owns TaskRow. Identity lookup selects only id/email; profile queries never select credential columns. Do not expose row types or driver errors to domain/presentation or import another feature's mapper.
2. Task row mapping checks stored status/priority against domain constants and rejects invalid values without defaulting. Corrupt persisted enums are unexpected internal failures, not client validation failures; global middleware returns a sanitized 500 response.
3. Generic UTC normalization lives in `foundation/persistence/normalizeSqliteTimestamp.ts`. Convert SQLite `YYYY-MM-DD HH:MM:SS` timestamps to ISO UTC during row mapping; preserve valid existing ISO strings. Never couple user mapping to task mapping.
4. Parameterize SQL. Task collections are scoped by user_id; individual updates/deletes include id and user_id. Preserve omitted nullable columns and set explicit null to SQL NULL. Translate unique-email constraints into `ConflictError` inside persistence adapters.
5. JWT/bcrypt implementations belong to `security/infrastructure/security/`. Include access/refresh type claims, verify expected type, translate JWT failures into `UnauthorizedError`, and never accept refresh tokens as access tokens or vice versa.
6. `foundation/database/` owns connection/migration/seed mechanics. Functions receive dependencies; no import-time connections. Seed takes an async hashing callback, supplied by App, and does not import feature adapters or choose hashing policy. App orchestrates cross-feature provisioning; preserve existing records, schema and seed behavior.
7. Generic HTTP parsing, identity extraction, logging and error translation live in `foundation/http/`. The generic authenticated-request contract is owned there, not imported from a security domain model. Token verification remains auth/security behavior wired by App.

## 4. Presentation and API

1. Each feature owns presentation schemas/DTOs/mappers/controllers/routes. AuthResponse and AccountResponse belong to security; ProfileResponse belongs to profile. Map explicit field whitelists independently so password hashes never leak. Preserve auth's public `user` envelope without importing profile models/DTOs into security; small explicit mapping duplication is preferable to cross-feature coupling.
2. Derive Zod task enums from domain constants. Keep request/response DTOs separate and response enum fields narrow. Preserve explicit null in clearable update schemas.
3. Controllers follow parsing → authenticated identity → use case → response mapping. Express 5 handles rejected async handlers; do not add redundant catch/rethrow blocks.
4. App injects authentication middleware into route factories. Identity comes only from verified access tokens, never request body userId.
5. Foundation error middleware maps ValidationError/UnauthorizedError/NotFoundError/ConflictError to 400/401/404/409, malformed JSON to 400, and unexpected errors to 500 with `{ error: 'Internal server error' }`. All error responses use `{ error: string }`.
6. Preserve `/api/auth`, `/api/users`, `/api/tasks`, existing camelCase JSON, ISO UTC timestamps and 200/201/204 success behavior during reorganization.

## 5. Module Folders, Barrels and Orphans

1. A module folder is `<feature>/<layer>/<sub>/` (e.g. `tasks/domain/models/`). For `app`, `foundation` and `shared` it is `<root>/<sub>/` (e.g. `foundation/http/`).
2. Imports from outside a module folder must go through that folder's `index.ts`. Imports inside the same module folder use relative paths. Barrels export only the folder's public API; internal pieces stay unexported.
3. No orphan source files. The only exceptions are the entry `src/server.ts` and `*.d.ts` files.
4. `src` never imports `tests`. `server/tests/` may import `client/src/<feature>/data/{dtos,mappers}` for the contract test, and nothing else from the client.

## 6. App and Verification

Only `app/config.ts` reads process.env; missing/default production JWT secrets must fail configuration. `dotenv` may be imported only by `server.ts` and `app/`. Only `app/container.ts` constructs repositories, security adapters, use cases, controllers and routers. `app/createApp.ts` mounts middleware/routes; `server.ts` invokes configuration/composition/migrations, awaits App-wired seed, then listens. Keep dist/server.js as the package entry.

Run server build, `npm test` (including strict test typechecking), `npm run test:startup` (compiled entry smoke tests), `npm run check:architecture`, and repository `git diff --check`. The compatibility test uses the unchanged client's validators/mappers without adding a production dependency on client code. Use only disposable databases in tests; startup smoke tests must explicitly set DB_PATH=:memory:, isolate environment/dotenv loading, use ephemeral ports, and stop their child processes. Boundaries (domain purity, inward port dependencies, feature isolation, foundation independence, library allowlists, barrels, orphans) are enforced by dependency-cruiser (`server/.dependency-cruiser.cjs`) via `npm run check:architecture`; every rule is error-level. Never weaken or ignore a rule to make it pass. App-only composition, error translation, tri-state patches and normalize-then-validate remain manual-review items.
