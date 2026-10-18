# Client Rules (React)

These rules extend the shared rules in the repository root `AGENTS.md`.

## 1. Layers and dependency direction

```text
Presentation ──→ Domain ←── Data
Foundation wires the layers together
```

```text
src/
├── domain/        # models, enums, use cases, repository contracts
├── data/          # api/, dtos/, mappers/, repositories/
├── presentation/  # screens/, components/, hooks/ (ViewModels), models/ (ViewState)
└── foundation/    # context/providers, network client, router
```

- The domain must not import React, React Query, Axios, browser APIs, UI types, DTOs, or concrete repositories.
- Presentation must not import API clients, DTOs, mappers, or concrete repository implementations.
- Data may depend on domain models and repository contracts while implementing persistence and transport details.

## 2. Layer responsibilities

### Domain

- Store entities, value objects, business rules, use cases, and repository interfaces here.
- Put business validation in entities, value objects, or use cases—not in components, API clients, or storage code.
- Model invalid states explicitly where practical; do not rely only on UI constraints.

### Data

- Store API clients, DTOs, schemas, mappers, and repository implementations here.
- Repositories are the only layer that should coordinate remote/local data access and cache invalidation.
- Map DTOs to domain models at the data boundary; do not leak transport shapes into the domain or presentation.
- Keep serialization, HTTP details, status codes, and backend field names inside this layer.
- Keep legacy field aliases, nullable transport values, and other compatibility handling inside data mappers.
- Normalize transport values, then validate with Zod before constructing domain models.

### Presentation

- Store screens, components, ViewModels/hooks, and presentation models here.
- Screens compose ViewModels and components; avoid business logic in screens.
- ViewModels own UI state, UI validation state, actions, loading/error state, and domain-to-view mapping.
- Components render props and emit user events. They must not call APIs, repositories, or use cases directly.
- Presentation models contain UI-friendly primitives and labels, not domain entities or enums unless the component genuinely renders a domain concept.

### Foundation

- Store application startup, dependency wiring, providers, routing, and shared infrastructure (network client) here.

## 3. Boundary mapping

- Data mapper: DTO ↔ domain model.
- ViewModel/presenter: domain model ↔ presentation model/ViewState.
- Validate string values from controls before converting them to domain enums or value objects.
- Provide display-ready values from the ViewModel, including headings, button labels, formatted text, and select options.
- Generate option lists from the authoritative domain values in the ViewModel; components only render the supplied options.

Example presentation contract:

```ts
export interface SelectOption {
  value: string;
  label: string;
}
```

## 4. ViewModels

- Name ViewModel hooks `use<Feature>ViewModel` and keep them in `presentation/hooks/`.
- Expose only what the view needs: ViewState, actions, and derived UI flags.
- Delegate business operations to use cases; do not duplicate business rules in ViewModels.
- Convert presentation values to validated domain inputs before invoking a use case.
- Convert domain outputs into display-ready ViewState before exposing them to components.
- Convert failures into presentation-friendly error state.
- Do not expose repositories, mutations, query clients, or raw DTOs to components.

## 5. Components and forms

- Prefer controlled components that receive values, errors, options, loading state, and callbacks through props.
- Keep reusable components domain-independent when they only need primitive display values.
- Do not import a domain enum merely to populate a select element; receive `SelectOption[]` from the ViewModel.
- Keep validation logic outside components. Components may render validation messages supplied by the ViewModel.
- Components display errors but do not classify infrastructure or domain failures.
- Extract focused subcomponents when a render function becomes difficult to scan, but do not create abstractions that only hide simple markup.
- Keep accessibility associations (`label`/`htmlFor`), disabled states, and semantic form elements intact during refactors.

## 6. Repositories and external systems

- Define repository contracts toward the domain side and implement them in `data/repositories/`.
- Access APIs, storage, and caches only through repository implementations or dedicated infrastructure adapters.
- Do not call APIs directly from screens, components, or ViewModels.
- Keep retry, cache, transport, and persistence behavior out of domain entities and pure use cases.

## 7. State initialization

- Initialize local state from inputs deliberately.
- Avoid effects whose only purpose is copying props into state.
- When a form should fully reset for another entity, prefer an explicit reset action or a stable React `key` that remounts the form boundary.
- Keep server state in React Query and transient view state in the ViewModel/component boundary.

## 8. React Query and client transport

- Convert API DTOs to domain models inside the data/repository boundary before query or mutation results reach presentation code.
- Include every input that affects a query result in its React Query key.
- After successful task creation, update, deletion, or status changes, invalidate the feature-level `['tasks']` key so all filtered task queries refresh.
- Keep authorization headers, token refresh, retry behavior, and base URL configuration in the shared network client (`foundation/network`) rather than feature APIs or components.
- Do not read authentication storage directly from screens or presentational components.

## 9. Project-specific transition rule

Some current hooks combine React Query or concrete repositories with domain use-case functions. Treat these as composition adapters, not as permission for pure domain logic to depend on `data/`. When modifying those flows, preserve testable pure business functions and move framework/repository wiring toward the application or presentation composition boundary when practical.

## 10. Naming and file placement

- Components and screens: PascalCase with a default export.
- ViewModel hooks: `use<Feature>ViewModel.ts`.
- Presentation models: `<Feature>ViewState.ts` in `presentation/models/`.
- DTOs and schemas belong in `data/dtos/`; mappers belong in `data/mappers/`.

## 11. Testing and verification

- Test domain rules and pure use cases without React or network mocks.
- Test mappers at the data boundary with representative DTOs.
- Test ViewModels for state transitions and domain/view conversion.
- Test components through observable rendering and user events rather than implementation details.
- After client changes, run:

```bash
cd client
npm run build
npm run lint
```
