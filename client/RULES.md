# Client Clean Architecture Rules (React)

These rules extend the root [`RULES.md`](../RULES.md) for the React client in `client/src/`.
For operational workflows and refactoring steps, see [`client/AGENTS.md`](./AGENTS.md).

---

## 1. Layer Dependency Rules

```text
Presentation ──→ Domain ←── Data
Foundation wires Domain, Data, and Presentation together
```

| Layer | Directory | Allowed Internal Imports | Forbidden Imports |
| :--- | :--- | :--- | :--- |
| **Domain** | `src/domain/` | `src/domain/models`, `src/domain/repositories` | `react`, `@tanstack/react-query`, `axios`, `zod`, `@mui/*`, `localStorage`, `window`, `src/data/*`, `src/presentation/*`, `src/foundation/*` |
| **Data** | `src/data/` | `src/domain/*`, `src/data/*`, `src/foundation/network/*` | `src/presentation/*` |
| **Presentation** | `src/presentation/` | `src/presentation/*`, `src/domain/*` (ViewModels/mappers only), `src/foundation/*` (hooks/providers) | `src/data/*`, `axios`, `zod`, `@tanstack/react-query`, `localStorage`, `@mui/*` (allowed only inside `src/presentation/components/ui/`) |
| **Foundation** | `src/foundation/` | `src/domain/*`, `src/data/*`, `src/presentation/*` (router screens/shell) | Direct business rule implementations, `@mui/*` (allowed only inside `src/foundation/theme/`) |

---

## 2. Domain Layer Rules (`src/domain/`)

1. **Pure TypeScript Only**: Entities, value objects, enums, repository contracts, and use cases must be pure TypeScript with zero framework or browser dependencies.
2. **One-Way Dependency Inside Domain**:
   - `domain/models/` owns entities (`Task`, `User`, `AuthSession`), enums (`TaskStatus`, `TaskPriority`), domain errors, and command/query value types (`CreateTaskInput`, `UpdateTaskInput`, `GetTasksInput`, `ToggleTaskStatusInput`, `UpdateProfileInput`, `LoginInput`, `RegisterUserInput`).
   - `domain/repositories/` imports only from `domain/models/`—never from `domain/useCases/`.
   - `domain/useCases/` imports from `domain/models/` and `domain/repositories/`.
3. **Complete Repository Interfaces**:
   - Every data operation (both reads and writes) must be represented on the repository interface:
     - `TaskRepository`: `getTasks`, `createTask`, `updateTask`, `deleteTask`, `toggleTaskStatus`.
     - `UserRepository`: `getCurrentUser`, `updateProfile`.
     - `AuthRepository`: `login`, `register`.
4. **Centralized Domain Validation**:
   - Put shared validation helpers (such as email validation and required-text normalization) in `domain/models/` so `UserModel`, `TaskModel`, and use cases share a single source of truth.
   - Validate all mutations in use cases (for example, `updateTaskUseCase` must reject an empty/whitespace-only `title`).
   - Do not require server-derived fields (such as `userId` on `CreateTaskInput`) in client domain inputs when ownership is determined by the authenticated session on the server.

---

## 3. Data Layer Rules (`src/data/`)

1. **DTO Separation**:
   - Define explicit Request and Response DTOs in `src/data/dtos/` for every API endpoint (`AuthDTO.ts`, `TaskDTO.ts`, `UserDTO.ts`).
   - API modules (`AuthApi.ts`, `TaskApi.ts`, `UserApi.ts`) must accept and return DTOs only—never domain models or use-case input types.
2. **Normalize + Zod Validate in Mappers**:
   - All DTO ↔ Domain conversions happen in `src/data/mappers/`.
   - Handle nullable fields (`.nullish().transform((v) => v ?? undefined)`) and legacy snake_case aliases (`due_date`, `user_id`, `created_at`, `updated_at`) inside schemas and mappers before constructing `TaskModel` or `UserModel`.
3. **Error Translation at the Data Boundary**:
   - Never let raw `AxiosError` or `ZodError` instances leak past `src/data/` with generic messages like `"Request failed with status code 400"`.
   - Extract the server's `{ error: string }` message (or Zod issue message) and throw a clean domain/application `Error` with the translated message at the API/repository boundary.
4. **React Query Encapsulation**:
   - Keep query keys, cache invalidation (`['tasks']`), and cache updates (`['user']`) inside `src/data/repositories/`.
   - Include all filter parameters in query keys (`['tasks', filters?.status, filters?.priority]`).

---

## 4. Presentation Layer Rules (`src/presentation/`)

1. **Screens & Components Must Not Hold Domain Entities**:
   - Screens (`src/presentation/screens/`) and components (`src/presentation/components/`) must render `ViewState` primitives and `SelectOption[]`—never raw `Task` or `User` domain entities.
   - When editing an item (e.g., `TaskListScreen`), pass the primitive task `id` (or ViewState) into the ViewModel rather than holding a `Task` domain entity in screen state.
2. **ViewModels Own All Form State & UI Validation**:
   - Every screen or form (`TaskForm`, `LoginScreen`, `RegisterScreen`, `ProfileEditForm`) delegates its state, validation errors, loading flags, and submit actions to a ViewModel hook (`use<Feature>ViewModel`) in `src/presentation/hooks/`.
   - Components must be controlled via props (`value`, `onChange`, `error`, `disabled`, `onSubmit`) rather than duplicating stateful business/form logic.
3. **One Screen, Cohesive ViewModel Composition**:
   - Screens should not compute domain statistics, slice collections, or merge multiple conflicting user sources inline; derive display-ready `ViewState` (such as dashboard stats, recent tasks, and greeting labels) in a ViewModel or presentation mapper (`src/presentation/models/`).
4. **Use Domain Methods in Presentation Mappers**:
   - Presentation mappers (`taskPresentation.ts`, `userPresentation.ts`) should use domain entity methods (`task.isCompleted()`, `task.isOverdue()`) where available rather than re-implementing domain rules.
5. **UI Components Stay in `src/presentation/components/`**:
   - Navigation bars (`Navbar`), dialogs, cards, and layout chrome belong in `src/presentation/components/`, not in `src/foundation/`.
   - When a component's render body mixes multiple distinct regions (e.g., a responsive table + card list + dialog + pagination), decompose it into prop-driven sub-components under a feature subfolder (`src/presentation/components/<feature>/`, e.g. `components/taskList/TaskTable.tsx`, `components/taskList/DeleteTaskDialog.tsx`). The public orchestrator component (e.g. `TaskListContent`) keeps shared local state (pagination, dialog targets), branch selection (loading / error / empty), and prop wiring; extracted sub-components stay stateless and receive `ViewState` + callbacks only.
   - Internal feature sub-components are not exported from `components/index.ts`; only screen-level entry components are.
6. **Sealed `ui/` Primitives Are the Only Component-Library Boundary**:
   - `@mui/*` (including `@mui/icons-material`) may only be imported inside `src/presentation/components/ui/` and `src/foundation/theme/`. Screens and components must compose `Ui*` primitives exclusively.
   - `ui/` wrapper props must be narrow and semantic: closed unions (`variant: 'solid' | 'outline' | 'text'`, `tone`, `size: 'sm' | 'md'`, `type`), layout-intent props (`gutterBottom`, `maxWidth`, `fullWidth`, `spaced`, `compact`), and value-based callbacks (`onChange: (value: string) => void`).
   - `ui/` wrappers must never accept `sx`, `component`, MUI `*Props` types, or forward `{...props}` spread to the underlying MUI component. Wrappers may use `sx`/MUI props **internally** only.
   - When a screen needs a primitive that does not exist yet, add a new `ui/` primitive with a semantic API (e.g., `UiStack`, `UiIconButton`, `UiTable*`, `UiResponsive`, `UiScreen`, `UiIcon` name registry) rather than importing MUI at the call site.

---

## 5. Foundation Layer Rules (`src/foundation/`)

1. **Network Client & 401 Interceptor (`src/foundation/network/axiosClient.ts`)**:
   - Attach the `Bearer` token from session storage in the request interceptor.
   - In the 401 response interceptor, **never** intercept or redirect on `/auth/login`, `/auth/register`, or `/auth/refresh` requests, so authentication errors reach the login/register ViewModel intact.
   - When token refresh fails on a protected request, clear the entire session (`clearSession()`, including stored user data) and notify auth state cleanly.
2. **Session Storage Validation & Auth Synchronization**:
   - Validate stored user JSON through `userToDomain` (Zod schema + `UserModel`) when hydrating a session from `localStorage`; if validation fails, clear the corrupted session.
   - Keep `AuthContext` and the React Query `['user']` cache synchronized: when `updateProfile` updates the user, update both the query cache and the active `AuthContext` session so `Navbar` and `DashboardScreen` never display stale user data.
