# Clean Architecture Agent Instructions (Shared)

Apply these instructions and the rules in [`RULES.md`](./RULES.md) to all new features, bug fixes, and refactors. Existing violations are never precedents; remediate them whenever they fall within the task scope.

## 1. Rule & Instruction Hierarchy

Before changing any code, read the rule and instruction files for every side you touch:

- **Shared**: [`RULES.md`](./RULES.md) and [`AGENTS.md`](./AGENTS.md)
- **Client (`client/`)**: [`client/RULES.md`](./client/RULES.md) and [`client/AGENTS.md`](./client/AGENTS.md)
- **Server (`server/`)**: [`server/RULES.md`](./server/RULES.md) and [`server/AGENTS.md`](./server/AGENTS.md)

## 2. Dependency Direction & Layer Boundaries

```text
Outer layers (UI / HTTP, persistence, transport) ──→ Domain
Application / Foundation composition wires the layers together
```

- Keep `domain/` 100% framework-agnostic.
- Keep `domain/repositories/` (client) and `domain/ports/` (server) dependent only on `domain/models/`, never on `domain/useCases/`.
- Convert data explicitly at every boundary (Persistence Row ↔ Domain Model ↔ Transport DTO ↔ Presentation ViewState).
- Isolate framework compromises in composition/adapter modules (`client/src/foundation/composition/`, `server/src/app/container.ts`).

## 3. Cross-Layer Change Workflow

When implementing or modifying a feature across client and server:

1. **Start in the Domain (`server/src/domain/` & `client/src/domain/`)**:
   - Define or update domain models, constants, value normalizers, and domain errors in `domain/models/`.
   - Update repository/port interfaces (`domain/ports/` on server, `domain/repositories/` on client) to cover both reads and writes.
   - Implement or update the single-operation `<Operation>UseCase.ts` in `domain/useCases/`.
2. **Implement Infrastructure / Data Adapters (`server/src/infrastructure/` & `client/src/data/`)**:
   - **Server**: Update row types and validated row-to-domain mappers in `infrastructure/persistence/`, then update SQLite/security adapters.
   - **Client**: Update request/response DTOs and Zod schemas in `data/dtos/`, update mappers in `data/mappers/`, translate HTTP/Axios errors into domain errors, and wire React Query caches in `data/repositories/`.
3. **Update Presentation (`server/src/presentation/` & `client/src/presentation/`)**:
   - **Server**: Update Zod request schemas, response DTO types, and domain-to-DTO mappers; wire controller handlers and routes.
   - **Client**: Map domain outputs into `ViewState` and `SelectOption[]` in `presentation/models/`; expose state, validation, and actions from `use<Feature>ViewModel.ts`; render purely via props in screens and components.
4. **Wire in Composition Root (`server/src/app/container.ts` & `client/src/foundation/`)**:
   - Connect concrete repositories and use cases at the application edge.

## 4. Architectural Self-Audit Checklist

Before completing any task, verify every item below:

- [ ] **No Reverse Dependencies**: Does `domain/` import anything from `data/`, `infrastructure/`, `presentation/`, `foundation/`, `app/`, React, Express, Axios, Zod, or SQLite? (Must be **No**).
- [ ] **No Upward Port Dependencies**: Do `domain/repositories/` or `domain/ports/` import from `domain/useCases/`? (Must be **No**; shared input/filter types belong in `domain/models/`).
- [ ] **Complete Read & Write Contracts**: Do read operations (`getTasks`, `getCurrentUser`) go through repository contracts and use cases rather than bypassing them? (Must be **Yes**).
- [ ] **Boundary Error Translation**: Are Axios/HTTP `{ error: string }` payloads, SQLite constraint errors, and JWT failures translated into domain/application errors at the adapter boundary? (Must be **Yes**).
- [ ] **No Domain Leaks in UI**: Do React screens or components hold domain entities (`Task`, `User`) or import domain enums directly instead of using `ViewState` and `SelectOption[]`? (Must be **No**).
- [ ] **Clearable Optional Fields**: Can nullable fields (`description`, `dueDate`, `bio`, `avatar`) be cleared with `null` or `""` on update without being ignored by `COALESCE` or stripped to `undefined`? (Must be **Yes**).

## 5. Verification Commands

Run the verification suite for every side you modify:

```bash
# Client verification
cd client && npm run build && npm run lint

# Server verification
cd server && npm run build

# Formatting / whitespace check
git diff --check
```

Fix all newly introduced errors and warnings before finishing.
