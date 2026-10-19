# Client Agent Instructions (React)

These instructions accompany [`.devin/rules/client-architecture.md`](./.devin/rules/client-architecture.md) and root [`AGENTS.md`](../AGENTS.md) / [`.devin/rules/clean-architecture.md`](../.devin/rules/clean-architecture.md).

## 1. Layer Overview & File Placement

```text
Presentation ──→ Domain ←── Data
Foundation wires the layers together
```

```text
src/
├── domain/
│   ├── models/        # Entities (Task, User, AuthSession), enums, value types, validation helpers
│   ├── repositories/  # Repository contracts (TaskRepository, UserRepository, AuthRepository)
│   └── useCases/      # Pure business use cases (<Operation>UseCase.ts)
├── data/
│   ├── api/           # HTTP transport calls returning DTOs (TaskApi, UserApi, AuthApi)
│   ├── dtos/          # Request/Response DTO interfaces and Zod schemas
│   ├── mappers/       # DTO ↔ Domain and Error translation mappers
│   └── repositories/  # React Query repository adapters implementing domain contracts
├── presentation/
│   ├── models/        # <Feature>ViewState.ts, SelectOption.ts, and domain → view mappers
│   ├── hooks/         # ViewModels (use<Feature>ViewModel.ts)
│   ├── components/    # Controlled UI components and reusable primitives (ui/)
│   └── screens/       # Route-level screens composing ViewModels and components
└── foundation/
    ├── auth/          # Validated session persistence helpers
    ├── composition/   # Hooks wiring domain use cases to data repositories
    ├── context/       # Application-wide providers (AuthContext)
    ├── network/       # Configured Axios instance and interceptors
    ├── router/        # Route definitions and guards (AppRouter, routeGuards)
    └── theme/         # MUI theme and color mode provider
```

---

## 2. Remediation Recipes for Common Client Violations

When reviewing or refactoring client code, apply these exact corrections:

### A. Read Queries Bypassing Repository Contracts
- **Symptom**: `TaskRepository` or `UserRepository` only defines mutations while ViewModels call `useTasksQuery` or `useCurrentUserQuery` directly without a use case or repository method.
- **Correction**:
  1. Define `getTasks(filters?: TaskFilters): Promise<Task[]>` on `TaskRepository` and `getCurrentUser(): Promise<User>` on `UserRepository`.
  2. Call `repository.getTasks(...)` inside `getTasksUseCase` and `repository.getCurrentUser()` inside `getCurrentUserUseCase`.
  3. In `foundation/composition/`, wrap the use case execution inside the React Query hook so ViewModels still get reactive query state while all data access flows through the domain use case and repository contract.

### B. Repository Contracts Importing from `domain/useCases/`
- **Symptom**: `domain/repositories/*.ts` imports `CreateTaskInput`, `LoginInput`, etc. from `../useCases/*`.
- **Correction**: Define command and filter types (`CreateTaskInput`, `UpdateTaskInput`, `GetTasksInput`, `ToggleTaskStatusInput`, `UpdateProfileInput`, `LoginInput`, `RegisterUserInput`) in `domain/models/` (and re-export from `domain/useCases/` if needed for backward compatibility).

### C. Raw Axios / Transport Errors Leaking into ViewModels
- **Symptom**: Failed API calls display `"Request failed with status code 400"` or `"Request failed with status code 409"` instead of the server's `{ error: string }` message.
- **Correction**:
  1. In `data/api/` or `foundation/network/axiosClient.ts`, translate `AxiosError` responses by extracting `error.response?.data?.error` into an `Error` instance before rejecting.
  2. In `data/mappers/`, translate `ZodError` issues into a readable domain error message.

### D. 401 Interceptor Redirecting During Login / Register
- **Symptom**: Wrong credentials on `/login` return HTTP `401`, triggering `window.location.href = '/login'` in `axiosClient.ts` and wiping out the login error message.
- **Correction**: In `axiosClient.ts`, bypass the 401 token-refresh logic whenever the request URL matches `/auth/login`, `/auth/register`, or `/auth/refresh`. When a refresh fails on a protected route, call `clearSession()` (clearing both tokens and stored user).

### E. Domain Entities (`Task`, `User`) Leaking into Screens or Components
- **Symptom**: `TaskListScreen` imports `Task` from `domain/models` to store `editingTask`, or `DashboardScreen` reads `user.name` directly from a domain `User` object.
- **Correction**:
  1. Store only primitive IDs (`editingTaskId: string | null`) or presentation state in ViewModels/Screens, and resolve the initial `TaskFormData` inside `useTaskFormViewModel` or `useTaskListViewModel`.
  2. Expose display-ready `ViewState` (`UserProfileViewState`, `DashboardViewState`, `TaskItemViewState`) from ViewModels.

### F. Local Form State in Screens Instead of ViewModels
- **Symptom**: `LoginScreen`, `RegisterScreen`, or `ProfileEditForm` manages field state and validation rules with inline `useState` instead of a ViewModel.
- **Correction**: Move field state, field validation, and submission handling into `useAuthViewModel` / `useUserViewModel` (or form-specific ViewModels) and pass controlled props to the form components.

### G. Stale User State Between `AuthContext` and React Query
- **Symptom**: Updating the profile updates React Query's `['user']` cache, but `Navbar` and `DashboardScreen` still show the old name from `AuthContext` / `localStorage`.
- **Correction**: Sync `AuthContext` (and `localStorage` session user) whenever the `['user']` query data updates or `updateProfile` succeeds, and validate `localStorage` user data through `userToDomain` on load.

### H. Monolithic Component Render Bodies
- **Symptom**: A component's `return` mixes several distinct UI regions—responsive table/card variants, dialogs, pagination, inline action-button groups—making the file hard to scan (e.g., the original `TaskListContent.tsx`).
- **Correction**:
  1. Extract each region into a prop-driven component under `components/<feature>/` (e.g., `taskList/TaskTable.tsx`, `taskList/TaskMobileCardList.tsx`, `taskList/TaskItemActions.tsx`, `taskList/DeleteTaskDialog.tsx`).
  2. Keep the entry component a thin orchestrator: it owns shared local state (`useState` for pagination, pending delete IDs), early-return branches (loading / error / empty), responsive wrappers (`UiResponsive`), and callback wiring.
  3. Extracted components receive `ViewState` + callbacks only—no `useState`, no ViewModel hooks, no domain imports.
  4. Do not export internal sub-components from `components/index.ts`; only the entry component is part of the public surface.

### I. Component-Library Props Leaking Through `ui/` Wrappers
- **Symptom**: `ui/` wrappers extend MUI prop types (`ButtonProps`, `TextFieldProps`, `sx`) or screens/components import `@mui/*` directly.
- **Correction**:
  1. Give the wrapper a narrow semantic prop API (`variant: 'solid' | 'outline' | 'text'`, `tone`, `size: 'sm' | 'md'`, `gutterBottom`, `onChange: (value: string) => void`)—never `sx`, `component`, or `{...props}` passthrough.
  2. Migrate call sites onto the semantic props; replace one-off `sx` tweaks with layout-intent props or `UiStack`/`UiFlex`/`UiResponsive` composition.
  3. For missing primitives, add a new `ui/` component with a sealed API (see `UiTable*`, `UiDrawer`/`UiNavList`, `UiIcon` name registry for patterns) instead of importing MUI at the call site.
  4. Verify `grep -r "from '@mui" src` only hits `components/ui/` and `foundation/theme/`.

---

## 3. Verification

After any client change, always run:

```bash
cd client
npm run build
npm run lint

# Confirm no MUI imports or `sx` outside the ui/ boundary
grep -rn "from '@mui" src --exclude-dir=ui | grep -v foundation/theme
grep -rn "sx=" src/presentation --exclude-dir=ui
```
