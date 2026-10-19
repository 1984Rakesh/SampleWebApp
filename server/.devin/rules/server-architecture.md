---
description: "Express server clean architecture rules"
trigger: always_on
---

# Server Clean Architecture Rules (Express + SQLite)

These rules extend the root [`.devin/rules/clean-architecture.md`](../../../.devin/rules/clean-architecture.md) for the Express/SQLite server in `server/src/`.
For operational workflows and refactoring steps, see [`server/AGENTS.md`](../../AGENTS.md).

---

## 1. Layer Dependency Rules

```text
presentation ──→ domain ←── infrastructure
app/ wires everything together
```

| Layer | Directory | Allowed Internal Imports | Forbidden Imports |
| :--- | :--- | :--- | :--- |
| **Domain** | `src/domain/` | `src/domain/*` | `express`, `zod`, `bcrypt`, `jsonwebtoken`, `better-sqlite3`, `dotenv`, `fs`, `path`, `process.env`, `src/infrastructure/*`, `src/presentation/*`, `src/app/*` |
| **Infrastructure** | `src/infrastructure/` | `src/domain/*`, `src/infrastructure/*` | `express`, `zod`, `src/presentation/*`, `src/app/*`, `process.env` |
| **Presentation** | `src/presentation/` | `src/domain/*`, `src/presentation/*`, `express`, `zod` | `better-sqlite3`, `bcrypt`, `jsonwebtoken`, `src/infrastructure/*`, `src/app/*`, `process.env` |
| **App / Bootstrap** | `src/app/`, `src/server.ts` | All layers | Business logic, inline SQL, or unvalidated request handling |

---

## 2. Domain Layer Rules (`src/domain/`)

1. **Authoritative Constants & Value Normalization**:
   - `domain/models/Task.ts` owns `TASK_STATUSES`, `TASK_PRIORITIES`, `DEFAULT_TASK_STATUS`, `DEFAULT_TASK_PRIORITY`, `normalizeTaskTitle`, and optional text normalization.
   - `domain/models/User.ts` owns `normalizeUserName`, `normalizeEmail` (trimming, lowercasing, and email format validation), and `validatePassword` (enforcing minimum password length of 6 characters).
2. **Use Case Invariants**:
   - Every use case is a class named `<Operation>UseCase` with constructor-injected ports and a single public `execute(input)` method.
   - `RegisterUserUseCase` and `LoginUseCase` must normalize email (`normalizeEmail`) and validate credentials using domain rules before calling ports.
   - `RefreshAccessTokenUseCase` must verify the refresh token using `tokenService.verifyRefreshToken(refreshToken)`, confirm the user still exists via `userRepository.findById(payload.userId)`, and issue a fresh access token.
   - Do not catch and rethrow errors in use cases when the port already throws the appropriate `DomainError`.
3. **Clearable Optional Fields**:
   - `TaskChanges` (`description`, `dueDate`) and `UserProfileChanges` (`bio`, `avatar`) must support `string | null | undefined` so callers can either omit a field (`undefined` = keep current value) or pass `null` / `""` (normalized to `null` = clear value in persistence).

---

## 3. Infrastructure Layer Rules (`src/infrastructure/`)

1. **Persistence Row Validation (`src/infrastructure/persistence/`)**:
   - Keep database row interfaces in `snake_case` (`TaskRow`, `UserRow`, `UserCredentialsRow`).
   - Validate enum columns (`row.status`, `row.priority`) against `TASK_STATUSES` and `TASK_PRIORITIES` in `rowToTask` rather than using unsafe `as TaskStatus` casts.
   - Normalize SQLite `CURRENT_TIMESTAMP` strings (`YYYY-MM-DD HH:MM:SS`) to ISO-8601 UTC format (`YYYY-MM-DDTHH:MM:SS.000Z` / `YYYY-MM-DDTHH:MM:SSZ`) during row-to-domain mapping so client date parsing is timezone-safe.
2. **Parameterized & User-Scoped SQL (`src/infrastructure/repositories/`)**:
   - Scope every task read, update, and delete query by `WHERE id = ? AND user_id = ?`.
   - Support clearing nullable columns (`description`, `due_date`, `bio`, `avatar`) when `null` is explicitly provided in `changes`, while preserving existing values when a field in `changes` is `undefined`.
   - Translate `SQLITE_CONSTRAINT_UNIQUE` into `ConflictError` at the repository boundary.
3. **Token Type Separation (`src/infrastructure/security/JwtTokenService.ts`)**:
   - Include an explicit token type claim (`type: 'access' | 'refresh'`) when signing JWTs.
   - `verifyAccessToken` must reject tokens whose `type !== 'access'`; `verifyRefreshToken` must reject tokens whose `type !== 'refresh'`. A refresh token must never be accepted as a Bearer token on protected routes, and an access token must never be accepted by `/api/auth/refresh`.
   - Translate all `jsonwebtoken` errors into `UnauthorizedError`.
4. **Database Seed & Migrations (`src/infrastructure/database/`)**:
   - Receive `db` (and any required security adapters/configuration) as function parameters; never instantiate database connections at module import time.

---

## 4. Presentation Layer Rules (`src/presentation/`)

1. **Request Schemas & Response DTOs (`src/presentation/schemas/`)**:
   - Derive Zod enums directly from domain constants (`z.enum(TASK_STATUSES)`, `z.enum(TASK_PRIORITIES)`).
   - Preserve `null` on clearable optional fields in update schemas (`updateTaskBodySchema`, `updateProfileBodySchema`) instead of transforming `null` to `undefined`.
   - Type response DTOs strictly (`TaskResponse.status: TaskStatus`, `TaskResponse.priority: TaskPriority`).
2. **Controllers (`src/presentation/controllers/`)**:
   - Follow the pipeline: `parseRequest(schema, input)` → `requireUserId(req)` → `useCase.execute(...)` → `dtoMapper(...)` → `res.json(...)`.
   - Never wrap async controller handlers in `try/catch`; Express 5 forwards rejected promises to `errorMiddleware`.
3. **Middleware (`src/presentation/middleware/`)**:
   - `authMiddleware` calls `tokenService.verifyAccessToken(...)` and attaches `req.user`.
   - `errorMiddleware` maps `ValidationError` → `400`, `UnauthorizedError` → `401`, `NotFoundError` → `404`, `ConflictError` → `409`, malformed JSON → `400`, and unknown errors → `500` with `{ error: 'Internal server error' }`.

---

## 5. Configuration & Bootstrap Rules (`src/app/`, `src/server.ts`)

1. **Single `process.env` Reader**:
   - Only `src/app/config.ts` reads `process.env`.
   - In production (`NODE_ENV === 'production'`), `loadConfig` must throw an error if `JWT_SECRET` is missing or set to the default development placeholder.
2. **Composition Root (`src/app/container.ts`)**:
   - Only `container.ts` instantiates repositories, security adapters, use cases, controllers, and routers.
