# Clean Architecture Rules

Apply these rules to new code and refactors. Existing violations are not precedents; improve them when they are within the task scope.

## 1. Dependency direction

Dependencies point toward stable business policy:

```text
Presentation ──→ Domain ←── Data
Foundation/Application wires the layers together
```

- The domain must not import React, React Query, Axios, browser APIs, UI types, DTOs, or concrete repositories.
- Presentation must not import API clients, DTOs, mappers, or concrete repository implementations.
- Data may depend on domain models and repository contracts while implementing persistence and transport details.
- Cross-layer communication should use explicit interfaces and plain data structures.
- If framework integration requires a compromise, isolate it in an adapter/composition module rather than mixing it into business logic.

## 2. Layer responsibilities

### Domain

- Store entities, value objects, business rules, use cases, and repository interfaces here.
- Keep domain code framework-agnostic and independently testable.
- Put business validation in entities, value objects, or use cases—not in components, API clients, or database code.
- Model invalid states explicitly where practical; do not rely only on UI constraints.

### Data

- Store API clients, DTOs, schemas, mappers, and repository implementations here.
- Repositories are the only layer that should coordinate remote/local data access and cache invalidation.
- Map DTOs to domain models at the data boundary; do not leak transport shapes into the domain or presentation.
- Keep serialization, HTTP details, status codes, and backend field names inside this layer.

### Presentation

- Store screens, components, ViewModels/hooks, and presentation models here.
- Screens compose ViewModels and components; avoid business logic in screens.
- ViewModels own UI state, UI validation state, actions, loading/error state, and domain-to-view mapping.
- Components render props and emit user events. They must not call APIs, repositories, or use cases directly.
- Presentation models should contain UI-friendly primitives and labels, not domain entities or enums unless the component genuinely renders a domain concept.

### Foundation/Application

- Store application startup, dependency wiring, providers, routing, and shared infrastructure here.
- Keep composition decisions at the application edge rather than hiding them inside components or entities.

## 3. Boundary mapping

- Convert values whenever they cross a layer boundary.
- Data mapper: DTO ↔ domain model.
- ViewModel/presenter: domain model ↔ presentation model/ViewState.
- Validate string values from controls before converting them to domain enums or value objects.
- Provide display-ready values from the ViewModel, including headings, button labels, formatted text, and select options.
- Generate option lists from the authoritative domain values in the ViewModel; components should only render the supplied options.

Example presentation contract:

```ts
export interface SelectOption {
  value: string;
  label: string;
}
```

## 4. Use cases

- Represent each user intent with a focused use case, such as create, update, delete, or load.
- A use case coordinates domain rules through repository interfaces and returns domain-oriented results.
- Keep use cases independent of rendering, form state, HTTP, and framework lifecycle.
- Do not duplicate business rules in ViewModels merely to avoid calling a use case.
- Prefer one public operation per use case over large service objects with unrelated methods.

## 5. ViewModels

- Name ViewModel hooks `use<Feature>ViewModel` and keep them in `presentation/hooks/`.
- Expose only what the view needs: ViewState, actions, and derived UI flags.
- Delegate business operations to use cases.
- Convert presentation values to validated domain inputs before invoking a use case.
- Convert domain outputs into display-ready ViewState before exposing them to components.
- Do not expose repositories, mutations, query clients, or raw DTOs to components.

## 6. Components and forms

- Prefer controlled components that receive values, errors, options, loading state, and callbacks through props.
- Keep reusable components domain-independent when they only need primitive display values.
- Do not import a domain enum merely to populate a select element; receive `SelectOption[]` from the ViewModel.
- Keep validation logic outside components. Components may render validation messages supplied by the ViewModel.
- Extract focused subcomponents when a render function becomes difficult to scan, but do not create abstractions that only hide simple markup.
- Keep accessibility associations (`label`/`htmlFor`), disabled states, and semantic form elements intact during refactors.

## 7. Repositories and external systems

- Define repository contracts toward the domain/application side and implement them in `data/repositories/`.
- Access APIs, storage, databases, and caches only through repository implementations or dedicated infrastructure adapters.
- Do not call APIs directly from screens, components, or ViewModels.
- Keep retry, cache, transport, and persistence behavior out of domain entities and pure use cases.

## 8. State initialization

- Initialize local state from inputs deliberately.
- Avoid effects whose only purpose is copying props into state.
- When a form should fully reset for another entity, prefer an explicit reset action or a stable React `key` that remounts the form boundary.
- Keep server state in the server-state mechanism and transient view state in the ViewModel/component boundary.

## 9. Error handling

- Use domain-specific errors for business-rule failures where useful.
- Translate transport and infrastructure failures before exposing them outside the data/application boundary.
- ViewModels convert failures into presentation-friendly error state.
- Components display errors but do not classify infrastructure or domain failures.
- Do not catch and immediately rethrow an error unless adding context, translating it, or updating required state.

## 10. Naming and file placement

- Components and screens: PascalCase with a default export.
- ViewModel hooks: `use<Feature>ViewModel.ts`.
- Presentation models: `<Feature>ViewState.ts` in `presentation/models/`.
- Use cases: `<Operation>UseCase.ts`.
- Repository contracts: `<Feature>Repository`; implementations should clearly indicate their technology or data source when multiple implementations exist.
- DTOs and schemas belong in `data/dtos/`; mappers belong in `data/mappers/`.
- Put shared types in the narrowest layer that owns their meaning. Do not define a type in a component merely because the component consumes it.

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

- Fix all newly introduced errors and warnings. Pre-existing warnings in untouched code may be reported without expanding task scope.

## 12. Project-specific transition rule

Some current hooks combine React Query or concrete repositories with domain use-case functions. Treat these as composition adapters, not as permission for pure domain logic to depend on `data/`. When modifying those flows, preserve testable pure business functions and move framework/repository wiring toward the application or presentation composition boundary when practical.
