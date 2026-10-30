---
name: clean-architecture
description: Shared clean-architecture rules for every platform — web client, server, iOS (dependency rule, boundaries, use cases, errors, API contract, naming, barrels, feature screens and navigation, public surface, DI). Use before changing domain, data/infrastructure, API contracts, navigation or module structure on any side.
---

# Clean Architecture Rules (Shared)

Apply to every platform. Side rules: [client](../client-architecture/SKILL.md), [server](../server-architecture/SKILL.md), [iOS](../ios-architecture/SKILL.md). The dependency-cruiser configs cite these section numbers (shared §n); keep them stable and append new sections at the end.

## 1. Dependency Rule

```text
Building blocks: Foundation → Features → App
Imports:         App → Features / Foundation
Inside feature:  Presentation → Domain ← Data (client) / Infrastructure (server)
```

- **App Owns Cross-Feature Composition**: App supplies cross-feature dependencies, links features (§9), owns the shell (root switch, tabs/navbar) and adapts cross-feature contracts. Each feature's assembly builds that feature's own internals (§10). Features never import App or sibling features; they declare narrow consumer-owned contracts that App injects. DI containers only as §11 allows.
- **Foundation**: generic technical capabilities only. It never imports features or App and holds no business policy.
- **Feature-First Layout**: each feature lives in `src/<feature>/` (web and server; iOS uses `Packages/Features/<Feature>/`, see the iOS rules) with only the layers it needs. No empty layers for symmetry, no top-level layer-first roots.
- **Domain Independence**: domain is pure language code (TypeScript, Swift): its own models, contracts and use cases plus `shared/domain`. No frameworks, HTTP clients, database drivers, validation libraries, foundation, environment/browser/Node APIs or outer layers.
- **One-Way Dependencies Within Domain**: use cases depend on contracts and models; contracts depend only on models, never on use cases.
- **Pure, Narrow Shared Kernel**: `shared/domain` holds only framework-free common errors and value rules; no feature entities, DTOs or framework types.

## 2. Boundaries

- **Explicit Conversion at Every Boundary**: Persistence Row ↔ Domain ↔ DTO ↔ ViewState, each mapping owned by the feature that owns the data. Features that share storage keep separate contracts and DTOs; App maps between them.
- **No Leaky Abstractions**: no column names, SQL types or driver errors beyond infrastructure; no DTOs, HTTP responses/errors or schemas beyond the data/presentation boundary; no domain entities or enums in screens/components (map to ViewState/options); no component-library types outside the UI boundary in the client rules.
- **Normalize, Then Validate**: normalize transport/persistence values (trim, legacy aliases, null/undefined, ISO-8601 UTC timestamps), then validate and construct domain models. Never fabricate missing IDs, ownership, enums or required fields.
- **Tri-State Patches**: for nullable fields in updates, `undefined` keeps, `null` (or normalized empty) clears, non-empty sets. Preserve all three through schemas, mappers and SQL.

## 3. Use Cases

- One focused `<Operation>UseCase` per user intent, reads included. Every read and write goes through a use case and a domain contract, never straight from a controller/ViewModel to an adapter.
- Domain invariants (required text, email, password, enums) are authoritative in domain. Outer schemas are structural only; never add conflicting copies.

## 4. Errors

- Domain failures are `DomainError` subclasses: `ValidationError`, `UnauthorizedError`, `NotFoundError`, `ConflictError`.
- Translate where the raw error appears: driver/JWT errors in infrastructure; domain errors to HTTP in server error middleware; HTTP/schema errors to domain errors in the client data layer, keeping backend messages.
- No catch-and-rethrow without translation or added context.

## 5. API Contract

Change every client (web, iOS) and the server together. `server/tests/client-contract.test.ts` checks only the web client; iOS DTO changes need manual review against the server schemas.
- JSON fields camelCase; timestamps ISO-8601 UTC; every error is `{ error: string }`.
- 200 read/update · 201 create · 204 delete (empty) · 400 validation/malformed · 401 unauthorized · 404 missing or not owned · 409 conflict · 500 `{ error: "Internal server error" }`.
- Identity comes only from the verified access token; clients never send `userId`.
- Request and response DTOs are separate; response enums use narrow domain literals.
- Public routes, browser routes, stored-session format and database schema/data stay compatible unless the task says otherwise.

## 6. Naming & Placement

- `PascalCase` classes, components and screens; `<Operation>UseCase.ts`; contracts `<Name>Repository.ts` in `domain/repositories/` (client) or `domain/ports/` (server); implementations named by technology (`Sqlite…`, `ReactQuery…`).
- Put each type in the narrowest owning layer (domain models, DTO folders, presentation models).
- Split a component with several render regions into prop-driven subcomponents in the owning feature; the entry component only orchestrates.

## 7. Module Folders, Barrels and No Orphans

- A module folder is `<feature>/<layer>/<sub>/`, or `<root>/<sub>/` for the non-feature roots (`app`, `foundation`, `shared`, `components`).
- Imports from outside a module folder go through its `index.ts`; same-folder imports are relative; barrels export only public API.
- **No Orphans**: every source file is imported, except entries and `*.d.ts`.

## 8. Enforcement

- dependency-cruiser on each side (`npm run check:architecture`); every rule is error-level. Never weaken, downgrade or `ignore` a rule; fix the code or raise a blocker.
- Manual review (tools do not check): component-library prop leakage, ViewState vs entity rendering, tri-state patches, error translation, normalize-then-validate, use-case coverage.
- Existing violations are not precedents; fix those inside the task's scope, with regression tests.

## 9. Feature Screens and Navigation

- **A Feature Owns Its Screens**: every screen of a user capability lives in that feature (e.g. tasks owns list, detail and create/edit). No feature per screen, no screen in App.
- **Internal Navigation**: moves between a feature's own screens are decided and performed by the feature (its coordinator/router module). App never sees internal routes.
- **External Navigation**: a feature declares outbound needs as a consumer-owned contract in its own vocabulary (e.g. `DashboardExternalRouting.openTasks(filter)`) and inbound entry points as a public route type (e.g. `TasksRoute.list(filter)`). App only links them, mapping one feature's types to the other's.
- Session changes (sign-in/out) switch the root through the session stream, never through feature navigation. Server features have no screens; this section applies to clients.

## 10. Public Surface and Feature Assembly

- **Only Contracts Are Public**: a feature exports use-case and repository contracts, routing contracts, the domain models/value types/errors those contracts mention, inbound route types, and exactly one assembly entry point. Concrete use cases, repositories, mappers, DTOs, ViewModels and screens stay feature-private (`package`/`internal` in Swift, unexported from barrels in TypeScript).
- **Feature Assembly**: the assembly is the only public non-contract symbol. It takes cross-feature dependencies (transport, session, outbound routers) and builds the feature's internals. Tests may reach internals through the platform's test access (`@testable import`, direct relative imports in test files).

## 11. Dependency Injection

- Constructor injection is the default. A DI container (Riverpod on Flutter, Factory on iOS) is allowed when the platform rules adopt it.
- Each feature registers only its own internals in its own container/scope, at feature-private visibility. Cross-feature dependencies are registered by App, through the feature assembly, never resolved from another feature's container.
- User-scoped registrations live in a session scope that App resets on sign-out. Tests override registrations in an isolated container per test.
