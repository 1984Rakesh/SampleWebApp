# Server Rules (Express + SQLite)

These rules extend the shared rules in the repository root `AGENTS.md`. The server follows a hexagonal (ports and adapters) Clean Architecture layout.

## 1. Layout

```text
src/
├── server.ts                 # Bootstrap only: load env, build container, migrate, seed, listen
├── app/
│   ├── config.ts             # Typed environment configuration (the only reader of process.env)
│   ├── container.ts          # Composition root: db → adapters → use cases → controllers → routers
│   └── createApp.ts          # Express setup, middleware chain, router mounting
├── domain/
│   ├── errors.ts             # DomainError and subclasses
│   ├── models/               # Entities, value types, authoritative constants
│   ├── ports/                # Interfaces implemented outside the domain (repositories, hasher, tokens)
│   └── useCases/<feature>/   # One class per operation
├── infrastructure/
│   ├── database/             # SQLite connection, migrations, seed (factories taking `db`)
│   ├── persistence/          # snake_case row types and row → domain mappers
│   ├── repositories/         # Sqlite<Feature>Repository implementing domain ports
│   └── security/             # Password hashing and token adapters implementing domain ports
└── presentation/
    ├── http/                 # parseRequest, requireUserId, other HTTP helpers
    ├── schemas/              # Zod request schemas and response DTO types
    ├── mappers/              # Domain → response DTO mappers
    ├── controllers/          # create<Feature>Controller factories
    ├── routes/               # create<Feature>Routes factories
    └── middleware/           # auth, error, request logging
```

Place new code in this layout. Do not recreate top-level `controllers/`, `routes/`, `middleware/`, `database/`, or `utils/` folders.

## 2. Dependency rules

```text
presentation ──→ domain ←── infrastructure
app/ wires everything together
```

- `domain/` imports nothing outside `domain/`: no Express, Zod, bcrypt, jsonwebtoken, better-sqlite3, or Node I/O.
- `infrastructure/` may import `domain/` and its own libraries; it never imports `presentation/`.
- `presentation/` may import `domain/` (use-case types, models, errors) plus Express and Zod; it never imports `infrastructure/`.
- Only `app/container.ts` instantiates concrete classes and injects them.

## 3. Domain

- Models and constants (for example `TASK_STATUSES`, `TASK_PRIORITIES`) are the single source of truth; schemas in other layers derive from them.
- Business rules (required fields, defaults, ownership semantics) live in models or use cases.
- Ports in `domain/ports/` define repository, password-hashing, and token contracts. Ports are async so adapters can be swapped.
- Use cases are classes named `<Operation>UseCase`, take ports through the constructor, and expose a single public `execute(input)` method.
- Use cases receive the authenticated `userId` as input; they never read HTTP state.
- Signal failures with domain errors (`ValidationError`, `UnauthorizedError`, `NotFoundError`, `ConflictError`).

## 4. Infrastructure

- Keep SQLite columns and row types in `snake_case` inside `infrastructure/persistence/`, together with row → domain mapping.
- Repositories implement domain ports and own all SQL, ID generation, and persistence details.
- Translate library and database failures into domain errors at this boundary (for example a UNIQUE constraint violation becomes `ConflictError`; JWT verification errors become `UnauthorizedError`).
- Database modules are factories or functions that receive `db`; do not create connections at import time.

## 5. Presentation

- Zod request schemas and response DTO types live in `presentation/schemas/`. Keep request and response DTOs separate.
- Centralize domain → response serialization in `presentation/mappers/` so list, create, update, and status endpoints cannot drift into different response shapes.
- Controllers are factories that receive use cases. A handler follows: `parseRequest(schema, input)` → `requireUserId(req)` (protected routes) → `useCase.execute(...)` → mapper → response.
- Validate inside the controller with `parseRequest` rather than replacing request properties in middleware (`req.query` is read-only in Express 5, and inline parsing keeps results typed).
- Do not wrap handlers in try/catch. Express 5 forwards rejected promises to the error middleware.
- Routers are factories that receive controllers and middleware.

## 6. Security and data safety

- Use parameterized SQL for every request-derived value. Never interpolate user input into SQL strings.
- Protected handlers derive identity from `req.user`; do not accept user ownership from request bodies or query parameters.
- Scope resource reads, updates, and deletes to the authenticated user in the SQL statement itself (for example `WHERE id = ? AND user_id = ?`), and report missing rows as `NotFoundError`.
- Do not expose database errors, token contents, stack traces, secrets, or internal implementation details in API responses.

## 7. Error middleware

- Mount the global error middleware after all routes.
- Map `ValidationError` → `400`, `UnauthorizedError` → `401`, `NotFoundError` → `404`, `ConflictError` → `409`; malformed JSON bodies → `400`; anything else → `500` with a generic message.
- Respond with `{ error: string }` only.
- Classify errors by type, never by matching error-message strings.

## 8. Configuration and bootstrap

- `server.ts` imports `dotenv/config` before any other import.
- Only `app/config.ts` reads `process.env`; pass configuration values into adapters through the container.
- Do not read environment variables at module import time anywhere else.
- Keep development diagnostics, including request logging, disabled in production.

## 9. Verification

After server changes, run:

```bash
cd server
npm run build
```

- The server currently has no configured automated test suite; its `npm test` script intentionally fails. Do not report it as a verification command until a real test runner is added.
- When test infrastructure is introduced, add focused coverage for use cases with fake ports, camelCase/snake_case normalization, nullable fields, missing required ownership, authenticated resource scoping, and consistent response serialization.
