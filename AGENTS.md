# Clean Architecture Rules (Shared)

Apply these rules to new code and refactors. Existing violations are not precedents; improve them when they are within the task scope.

This file holds rules shared by the whole repository. Layer-specific rules live next to the code:

- `client/AGENTS.md` — React client (domain, data, presentation, foundation).
- `server/AGENTS.md` — Express/SQLite server (domain, infrastructure, presentation, app).

Read the shared rules and the file for every side you change.

## 1. Dependency direction

Dependencies point toward stable business policy:

```text
Outer layers (UI / HTTP, persistence, transport) ──→ Domain
Application/composition code wires the layers together
```

- The domain is framework-agnostic and independently testable.
- Outer layers depend on domain models and contracts, never the reverse.
- Cross-layer communication uses explicit interfaces and plain data structures.
- If framework integration requires a compromise, isolate it in an adapter/composition module rather than mixing it into business logic.
- Keep composition decisions at the application edge rather than hiding them inside components, controllers, or entities.

## 2. Boundary mapping

- Convert values whenever they cross a layer boundary.
- Do not leak transport shapes (DTOs, JSON field names, status codes) or persistence shapes (rows, columns) into the domain.
- Normalize transport values before validation, then validate before constructing domain models.
- Preserve strict domain invariants during normalization. Do not invent missing IDs, ownership, statuses, or other required business values.

## 3. Use cases

- Represent each user intent with a focused use case, such as create, update, delete, or load.
- A use case coordinates domain rules through repository/port interfaces and returns domain-oriented results.
- Keep use cases independent of rendering, form state, HTTP, persistence, and framework lifecycle.
- Do not duplicate business rules in outer layers merely to avoid calling a use case.
- Prefer one public operation per use case over large service objects with unrelated methods.

## 4. Error handling

- Use domain-specific errors for business-rule failures where useful.
- Translate transport and infrastructure failures at the boundary before they reach other layers.
- Do not catch and immediately rethrow an error unless adding context, translating it, or updating required state.

## 5. API contract (client ↔ server)

Both sides depend on this contract; change it deliberately and update both sides together.

- Public JSON fields are `camelCase`.
- Errors are returned as `{ error: string }`.
- Status codes: `400` invalid input, `401` authentication failure, `404` unavailable user-scoped resource, `409` conflict, `500` unexpected failure.
- Successful creation returns `201`; successful deletion returns `204` with no body.
- Before changing a response shape, check the client's transport schemas (`client/src/data/`) for compatibility.
- Keep request and response DTOs separate when their valid fields differ; do not weaken response contracts to accommodate partial mutation inputs.

## 6. Naming and file placement

- Classes, components, and screens: PascalCase.
- Use cases: `<Operation>UseCase.ts`.
- Repository contracts: `<Feature>Repository`; implementations clearly indicate their technology or data source (for example `SqliteTaskRepository`).
- Put shared types in the narrowest layer that owns their meaning. Do not define a type in a consumer merely because it consumes it.

## 7. Verification

- Run the verification commands from `client/AGENTS.md` and/or `server/AGENTS.md` for every side you change.
- When a change crosses client and server boundaries, run both.
- Run `git diff --check` before completing documentation-only or cross-layer changes.
- Fix all newly introduced errors and warnings. Pre-existing warnings in untouched code may be reported without expanding task scope.
