---
description: "Shared clean architecture rules"
trigger: always_on
---

# Clean Architecture Rules (Shared)

These rules govern the entire repository. Layer-specific rules live alongside each application:

- [`client/.devin/rules/client-architecture.md`](../../client/.devin/rules/client-architecture.md) — React client feature/App/shared UI rules (C2 security/profile/session complete).
- [`server/.devin/rules/server-architecture.md`](../../server/.devin/rules/server-architecture.md) — Express + SQLite feature, foundation and App rules.
- [`AGENTS.md`](../../AGENTS.md), [`client/AGENTS.md`](../../client/AGENTS.md), and [`server/AGENTS.md`](../../server/AGENTS.md) — Operational instructions and remediation workflows for coding agents.

---

## 1. Dependency Rule

Dependencies always point inward toward stable business policy:

```text
Building blocks: Foundation → Features → App
Imports: App → Features / Foundation
Inside a feature: Presentation → Domain ← Data / Infrastructure
```

- **App Owns Composition**: App binds features, injects dependencies and adapts cross-feature contracts. Foundation exposes reusable technical capabilities and never imports features or App. Features never import App; inject consumer-owned capabilities rather than using an App service locator or importing sibling feature internals.
- **Feature-First Organization**: Features live directly under `src/` with their own layers as applicable. Server features are security/profile/tasks; client also has dashboard/comparison. Foundation, shared domain and client shared components do not require artificial feature layers. No empty server counterparts for client-only features.
- **Migration Status (C2, server accepted)**: Server security/profile/tasks each own their layers under `server/src/<feature>/`; generic utilities live under `server/src/foundation/`; common errors/name/optional-text normalization live under `server/src/shared/domain/`. Security account and profile contracts, persistence and DTOs are separate despite using the same users table. No server business code remains in top-level layer-first roots. Server audit, disposable-data regression tests, compiled startup/production-config/CORS checks and unchanged-client mapper compatibility pass. Obsolete empty source roots and stale generated output were removed with explicit approval and dist rebuilt. Client App/shared UI plus security/profile domain/data/presentation are migrated through C2. Separate account/profile models, DTOs and consumer contexts are wired and mapped in App. Foundation network/storage/theme has no feature/App imports; security owns session validation and auth lifecycle policy. Tasks/dashboard/comparison remain in legacy roots until C3/C4. App injects task counts/profile summaries rather than allowing feature implementation imports; shared/data owns common outer-boundary error translation, never domain policy. Server phases precede client phases; pause after every phase for approval.

- **Domain Independence**: The `domain/` layer is framework-agnostic and independently testable. It must never import UI frameworks, HTTP clients, ORMs/database drivers, validation libraries (such as Zod), or concrete adapter implementations.
- **One-Way Dependencies Within Domain**: Within `domain/`, `useCases/` depend on `repositories/` (or `ports/`) and `models/`. Repository/port contracts must depend only on `domain/models/`—never upward on `domain/useCases/`.
- **Composition at the Edge**: Concrete feature implementations are instantiated and wired only in App (`server/src/app/container.ts`; client `client/src/app/composition/` and `app/providers/`). Consumers depend on owned presentation contracts, never App/data implementations; App injects capabilities into those contexts.
- **Pure, Narrow Shared Kernel**: `shared/domain/` owns only framework-free common errors/value rules. Do not put feature entities, DTOs, framework types or generic dumping-ground abstractions there. Domain must not import foundation; feature outer layers may consume its appropriate generic capabilities. Shared client components must not import features or App.

---

## 2. Strict Boundary Mapping

- **Explicit Conversion at Every Boundary**:
  - Persistence Row ↔ Domain Model (`server/src/<feature>/infrastructure/persistence/`; row contracts and mapping belong to the feature, not a shared User abstraction).
  - Domain Model ↔ HTTP Request/Response DTO (server feature presentation; client security/profile data, with task adapters still in legacy `client/src/data/` until C3).
  - Domain Model ↔ Presentation ViewState (client security/profile presentation; remaining task/dashboard/comparison UI in legacy `client/src/presentation/` until C3/C4).
- **No Leaky Abstractions**:
  - Never leak database column names (`snake_case`), SQL types, or driver errors into `domain/` or `presentation/`.
  - Never leak HTTP DTOs, Axios responses/errors, or Zod schemas into `domain/` or UI components.
  - Never leak domain entities or domain enums directly into presentational components or screens when a `ViewState` / `SelectOption` contract belongs at the boundary.
  - Never leak the component library's prop surface (MUI `*Props`, `sx`, `component`, library-specific enums like `variant="contained"` or `severity`) through wrapper components—MUI imports belong only in sealed UI wrappers (`client/src/components/ui/`) and `foundation/theme/`; wrapper props must be narrow and semantic (`tone`, `variant: 'solid' | 'outline' | 'text'`, `type`, `gutterBottom`, `size: 'sm' | 'md'`).
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
  - **Client Data → Domain**: Extract backend `{ error: string }` messages from HTTP/Axios errors and translate transport/validation failures into domain/application errors inside the owning client data layer (security/profile feature data; remaining task data in legacy `client/src/data/` until C3) before they reach ViewModels.
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
- **Component Decomposition**: When a presentational component grows into multiple distinct render regions, extract each region into its own prop-driven component under the owning feature's presentation components (target `client/src/<feature>/presentation/components/`; currently legacy `client/src/presentation/components/<feature>/`) rather than growing a single file. The entry component stays a thin orchestrator owning shared UI state and prop wiring.
