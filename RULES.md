# Clean Architecture Rules (Shared)

These rules govern the entire repository. Layer-specific rules live alongside each application:

- [`client/RULES.md`](./client/RULES.md) — React client layer rules (Domain, Data, Presentation, Foundation).
- [`server/RULES.md`](./server/RULES.md) — Express + SQLite server layer rules (Domain, Infrastructure, Presentation, App).
- [`AGENTS.md`](./AGENTS.md), [`client/AGENTS.md`](./client/AGENTS.md), and [`server/AGENTS.md`](./server/AGENTS.md) — Operational instructions and remediation workflows for coding agents.

---

## 1. Dependency Rule

Dependencies always point inward toward stable business policy:

```text
Outer layers (UI / HTTP, persistence, transport) ──→ Domain
Application / Foundation composition wires the layers together
```

- **Domain Independence**: The `domain/` layer is framework-agnostic and independently testable. It must never import UI frameworks, HTTP clients, ORMs/database drivers, validation libraries (such as Zod), or concrete adapter implementations.
- **One-Way Dependencies Within Domain**: Within `domain/`, `useCases/` depend on `repositories/` (or `ports/`) and `models/`. Repository/port contracts must depend only on `domain/models/`—never upward on `domain/useCases/`.
- **Composition at the Edge**: Concrete implementations are instantiated and wired only in the composition root (`server/src/app/container.ts` on the server; `client/src/foundation/` on the client).

---

## 2. Strict Boundary Mapping

- **Explicit Conversion at Every Boundary**:
  - Persistence Row ↔ Domain Model (`server/src/infrastructure/persistence/`)
  - Domain Model ↔ HTTP Request/Response DTO (`server/src/presentation/` and `client/src/data/`)
  - Domain Model ↔ Presentation ViewState (`client/src/presentation/`)
- **No Leaky Abstractions**:
  - Never leak database column names (`snake_case`), SQL types, or driver errors into `domain/` or `presentation/`.
  - Never leak HTTP DTOs, Axios responses/errors, or Zod schemas into `domain/` or UI components.
  - Never leak domain entities or domain enums directly into presentational components or screens when a `ViewState` / `SelectOption` contract belongs at the boundary.
- **Normalize, Then Validate**:
  - Normalize transport and persistence values (trimming strings, resolving legacy field aliases, coalescing `null`/`undefined`, normalizing timestamps to ISO-8601) before validating and constructing domain models.
  - Preserve strict domain invariants during normalization; never fabricate missing IDs, ownership (`userId`), statuses, or required fields.
- **Tri-State Patch Semantics**:
  - For partial update (PATCH/PUT) operations on optional/nullable fields (`description`, `dueDate`, `bio`, `avatar`), distinguish between:
    1. `undefined`: field omitted — keep the existing value.
    2. `null` (or normalized empty string `""` when clearing): clear the value (`NULL` in persistence).
    3. Non-empty string: update to the new value.

---

## 3. Use Case Design

- **Single User Intent**: Represent each user operation (both **queries/reads** and **mutations/writes**) with a focused use case (`GetTasksUseCase`, `GetCurrentUserUseCase`, `CreateTaskUseCase`, `UpdateTaskUseCase`, `DeleteTaskUseCase`, `ToggleTaskStatusUseCase`, `LoginUseCase`, `RegisterUserUseCase`, `RefreshAccessTokenUseCase`, `UpdateProfileUseCase`).
- **Complete Repository Contracts**: Every use case (including read queries) operates through a domain repository/port interface—never by bypassing the domain layer to call an API client or cache hook directly from a ViewModel or controller.
- **Authoritative Domain Validation**:
  - Required fields, string normalization, email format validation, password length rules, and valid enum transitions belong in `domain/` (`models/` or `useCases/`).
  - Do not duplicate conflicting validation rules across layers. Outer layers may perform structural/schema parsing (e.g., Zod at the HTTP boundary or UI field hints), while domain invariants remain authoritative.

---

## 4. Error Handling & Boundary Translation

- **Domain Error Hierarchy**: Represent business-rule and domain failures using explicit `DomainError` subclasses (`ValidationError`, `UnauthorizedError`, `NotFoundError`, `ConflictError`).
- **Translate at the Boundary**:
  - **Server Infrastructure → Domain**: Translate database constraint errors (e.g., `SQLITE_CONSTRAINT_UNIQUE` → `ConflictError`) and JWT/crypto errors (`JsonWebTokenError` / `TokenExpiredError` → `UnauthorizedError`) inside infrastructure adapters.
  - **Server Presentation → HTTP**: Map `DomainError` subclasses to HTTP status codes and `{ error: string }` payloads in global error middleware.
  - **Client Data → Domain**: Extract backend `{ error: string }` messages from HTTP/Axios errors and translate transport/validation failures into domain/application errors inside `client/src/data/` before they reach ViewModels.
- **No Redundant Catch-and-Rethrow**: Never catch an error only to immediately rethrow it or wrap it in the same error type without adding context or translating across a boundary.

---

## 5. Client ↔ Server API Contract

Both sides depend on this contract; update both sides together whenever it changes:

- **Format**: Public JSON request and response fields use `camelCase`. Timestamps are serialized as ISO-8601 UTC strings.
- **Error Envelope**: All error responses return `{ error: string }`.
- **HTTP Status Codes**:
  - `200`: Successful read or update.
  - `201`: Successful resource creation.
  - `204`: Successful deletion (empty body).
  - `400`: Validation or malformed request failure (`ValidationError`).
  - `401`: Authentication or token failure (`UnauthorizedError`).
  - `404`: Missing or unauthorized user-scoped resource (`NotFoundError`).
  - `409`: Resource conflict such as duplicate email (`ConflictError`).
  - `500`: Unexpected internal failure (`{ error: "Internal server error" }`).
- **Identity & Ownership**:
  - Authenticated identity (`userId`) is derived exclusively from the verified Bearer access token on the server.
  - Client mutation payloads (`CreateTask`, `UpdateTask`, `UpdateProfile`) must never send `userId` in the request body.
- **Separate Request and Response DTOs**: Keep request schemas/DTOs distinct from response DTOs; type response fields using narrow domain literals (`TaskStatus`, `TaskPriority`) where applicable.

---

## 6. Naming & File Placement

- **Classes, Components, and Screens**: `PascalCase`.
- **Use Cases**: `<Operation>UseCase.ts`.
- **Repository Interfaces**: `<Feature>Repository.ts` in `domain/repositories/` (client) or `domain/ports/` (server).
- **Repository Implementations**: Prefix or suffix with the backing technology (`SqliteTaskRepository.ts`, `ReactQueryTaskRepository.ts`).
- **Type Ownership**: Define shared types in the narrowest layer that owns their meaning (`domain/models/` for domain value types, `data/dtos/` or `presentation/schemas/` for DTOs, `presentation/models/` for `ViewState`).
