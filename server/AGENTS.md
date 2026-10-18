# Server Agent Instructions (Express + SQLite)

These instructions accompany [`server/RULES.md`](./RULES.md) and root [`AGENTS.md`](../AGENTS.md) / [`RULES.md`](../RULES.md).

## 1. Layer Overview & File Placement

```text
presentation ──→ domain ←── infrastructure
app/ wires everything together
```

```text
src/
├── server.ts                 # Bootstrap only: dotenv, loadConfig, createContainer, migrate, seed, listen
├── app/
│   ├── config.ts             # Typed environment configuration (the ONLY reader of process.env)
│   ├── container.ts          # Composition root: db → adapters → use cases → controllers → routers
│   └── createApp.ts          # Express setup, middleware chain, router mounting
├── domain/
│   ├── errors.ts             # DomainError, ValidationError, UnauthorizedError, NotFoundError, ConflictError
│   ├── models/               # Entities, value types, authoritative constants, domain validation functions
│   ├── ports/                # Async interfaces for repositories, PasswordHasher, TokenService
│   └── useCases/<feature>/   # Single-operation use case classes (<Operation>UseCase.ts)
├── infrastructure/
│   ├── database/             # SQLite connection, migrations, seed (functions taking `db`)
│   ├── persistence/          # snake_case row interfaces and validated row → domain mappers
│   ├── repositories/         # Sqlite<Feature>Repository implementing domain ports
│   └── security/             # BcryptPasswordHasher and JwtTokenService implementing domain ports
└── presentation/
    ├── http/                 # parseRequest, requireUserId
    ├── schemas/              # Zod request schemas and typed response DTO interfaces
    ├── mappers/              # Domain → response DTO mappers
    ├── controllers/          # create<Feature>Controller factories
    ├── routes/               # create<Feature>Routes factories
    └── middleware/           # authMiddleware, errorMiddleware, requestLogger
```

---

## 2. Remediation Recipes for Common Server Violations

When reviewing or refactoring server code, apply these exact corrections:

### A. Missing Domain Validation in Auth & User Flows
- **Symptom**: `RegisterUserUseCase` or `LoginUseCase` relies solely on presentation Zod schemas, allowing un-normalized email casing, invalid email formats, whitespace-only names, or short passwords when called directly.
- **Correction**:
  1. Define `normalizeUserName(name)`, `normalizeEmail(email)`, and `validatePassword(password)` in `domain/models/User.ts`, throwing `ValidationError` when invariants fail.
  2. Call these helpers inside `RegisterUserUseCase`, `LoginUseCase`, and `UpdateProfileUseCase`.

### B. Access and Refresh Token Confusion
- **Symptom**: `JwtTokenService` signs both access and refresh tokens with identical claims, allowing a refresh token to be used as a Bearer access token (or vice versa), and `RefreshAccessTokenUseCase` does not verify that the user still exists.
- **Correction**:
  1. Split verification on `TokenService` into `verifyAccessToken(token: string): Promise<TokenPayload>` and `verifyRefreshToken(token: string): Promise<TokenPayload>`.
  2. Include a `type: 'access' | 'refresh'` claim in JWT payloads inside `JwtTokenService` and verify that the decoded `type` matches the expected token type.
  3. Inject `UserRepository` into `RefreshAccessTokenUseCase` to verify the user still exists (`findById`) before issuing a new access token.
  4. Remove redundant `.catch()` blocks in `RefreshAccessTokenUseCase` since `JwtTokenService` already throws `UnauthorizedError`.

### C. Unable to Clear Optional Fields (`description`, `dueDate`, `bio`, `avatar`)
- **Symptom**: Zod transforms `null` into `undefined`, and SQL `COALESCE(?, column)` ignores `null`, making it impossible for users to clear a task's description/dueDate or a user's bio/avatar.
- **Correction**:
  1. Allow `string | null | undefined` in `TaskChanges` and `UserProfileChanges` (and normalize empty strings `""` to `null` in domain normalizers).
  2. In `TaskDto.ts` and `UserDto.ts` update schemas, preserve `null` (do not coalesce `null` to `undefined`).
  3. In `SqliteTaskRepository.update` and `SqliteUserRepository.updateProfile`, distinguish `undefined` (keep existing column value) from `null` (set column to `NULL`).

### D. Unvalidated Persistence Casts & Non-ISO Timestamps
- **Symptom**: `rowToTask` uses `row.status as TaskStatus` without checking `TASK_STATUSES`, and SQLite `CURRENT_TIMESTAMP` returns `'YYYY-MM-DD HH:MM:SS'` without a UTC `Z` suffix.
- **Correction**:
  1. Validate `row.status` and `row.priority` against `TASK_STATUSES` and `TASK_PRIORITIES` in `TaskRow.ts`.
  2. Normalize SQLite timestamps (`YYYY-MM-DD HH:MM:SS`) to ISO-8601 UTC (`YYYY-MM-DDTHH:MM:SSZ`) in `TaskRow.ts` and `UserRow.ts`.

### E. Weak Response DTO Types & Insecure Production Config
- **Symptom**: `TaskResponse` types `status` and `priority` as `string` instead of `TaskStatus` and `TaskPriority`; `loadConfig` falls back to `'your-super-secret-jwt-key'` in production.
- **Correction**:
  1. Use `TaskStatus` and `TaskPriority` in `TaskResponse` (`presentation/schemas/TaskDto.ts`).
  2. In `app/config.ts`, throw an error when `isProduction` is true and `env.JWT_SECRET` is missing or uses the default placeholder.

---

## 3. Verification

After any server change, always run:

```bash
cd server
npm run build
```
