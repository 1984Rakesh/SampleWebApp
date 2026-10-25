---
description: "Express server clean architecture rules"
trigger: always_on
---

# Server Clean Architecture Rules (Express + SQLite)

Extend the [shared rules](../../../.devin/rules/clean-architecture.md). Inside a feature: Presentation → Domain ← Infrastructure. The dependency-cruiser config cites these section numbers; keep them stable.

## 1. Module and Layer Dependencies

| Module | Allowed | Forbidden |
| :--- | :--- | :--- |
| Feature domain | Own models/ports/use cases, `shared/domain` | Other features, foundation, App, outer layers, Express, Zod, SQLite/crypto, Node/env APIs |
| Feature infrastructure | Own domain/infrastructure, generic foundation, `shared/domain` | Other features, presentation, App, Express, Zod, `process.env` |
| Feature presentation | Own domain/presentation, `foundation/http`, `shared/domain` | Other features, infrastructure, App, SQLite/bcrypt/JWT, `process.env` |
| Foundation | Own generic modules, `shared/domain`, technical libraries | Features, App, business policy, `process.env` |
| Shared domain | Itself only | Frameworks, foundation, App, features |
| App / bootstrap | All layers, for composition | Business rules, inline SQL, unvalidated request handling |

Features that share a table own separate ports and adapters; App gives both adapters the same database. Cross-feature capabilities are consumer-owned ports injected by App.

## 2. Domain Rules

1. Each feature's models own its constants, creation defaults, filter/change types and normalization; common optional-text and name normalization and the errors live in `shared/domain`.
2. No universal User entity: credential/token types belong to the auth feature, profile types to profile.
3. Use cases are constructor-injected `<Operation>UseCase` classes with one public `execute`. Reads and writes use ports; ports import models, never use cases. Validate invariants before calling adapters; Zod parsing is structural only.
4. Auth flows normalize and validate before calling ports and keep the existing invalid-credentials response. Refresh verifies the token type, looks up the current stored identity and rejects missing accounts.
5. Nullable changes accept `string | null | undefined` with tri-state semantics. Never fabricate identity, ownership, status or other required persisted values.

## 3. Infrastructure and Foundation

1. Each feature's `infrastructure/persistence/` owns its snake_case row types and explicit mapping; select only needed columns (never credential columns outside auth); never import another feature's mapper.
2. Row mappers reject unknown stored enums without defaulting; corrupt data is a 500, not a `ValidationError`.
3. Generic UTC timestamp normalization lives in `foundation/persistence/`; mappers convert SQLite timestamps to ISO UTC.
4. Parameterized SQL only. Scope user data by `user_id` in every query and mutation. Omitted nullable columns stay unchanged; explicit null writes NULL (no COALESCE on clearable columns). Unique-constraint errors become `ConflictError` in the adapter.
5. bcrypt/JWT implementations live only in `security/infrastructure/security/`. Access and refresh tokens carry distinct type claims and are verified for the expected type; JWT failures become `UnauthorizedError`.
6. `foundation/database/` owns connection, migrations and seed mechanics with injected dependencies (seed takes a hashing callback from App); nothing connects or seeds at import time.
7. `foundation/http/` owns generic parsing, identity extraction, logging and error middleware; token verification is wired in by App.

## 4. Presentation and API

1. Each feature owns its schemas, DTOs, mappers, controllers and routes. Responses use explicit field whitelists so credentials never leak.
2. Zod enums derive from domain constants; clearable update schemas accept explicit null.
3. Controllers: parse → authenticated identity → use case → map response. Express 5 handles async rejections; no redundant try/catch.
4. App injects authentication middleware into route factories; identity comes only from the verified access token.
5. Error middleware maps domain errors and malformed JSON per shared §5 and sanitizes unexpected errors.

## 5. Module Folders, Barrels and Orphans

1. Module folders as in shared §7; non-feature roots are `app`, `foundation`, `shared`.
2. Cross-folder imports use the folder's `index.ts`; same-folder imports are relative; barrels export only public API.
3. No orphans except the entry `src/server.ts` and `*.d.ts`.
4. `src` never imports `tests`. `server/tests/` may import only `client/src/<feature>/data/{dtos,mappers}` (contract test).

## 6. App and Verification

- Only `app/config.ts` reads `process.env` and rejects missing/default production JWT secrets; `dotenv` only in `server.ts` and `app/`. Only `app/container.ts` constructs adapters, use cases, controllers and routers; `app/createApp.ts` mounts middleware and routes; `server.ts` configures, migrates, awaits the seed, then listens.
- `src` uses only packages in `dependencies`, never devDependencies; every import resolves.
- Run `npm run build`, `npm test`, `npm run test:startup`, `npm run check:architecture` and `git diff --check`. Test safety rules are in [server/AGENTS.md](../../AGENTS.md).
