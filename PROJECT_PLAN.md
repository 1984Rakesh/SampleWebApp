# Clean Architecture Full-Stack Educational Web App

## Project Overview
Create a full-stack educational web app that demonstrates Clean Architecture principles familiar to iOS developers, with an interactive "iOS vs Web Architectural Rosetta Stone" dashboard featuring side-by-side code snippets.

## Technology Stack
- **Frontend**: React + Vite + TypeScript + Tailwind CSS + TanStack Query + React Router
- **Backend**: Node.js + Express + TypeScript + SQLite + JWT authentication
- **Comparison**: Interactive panels showing TypeScript vs Swift code for each architectural layer

---

## Phase 0: Documentation Setup ✅
**Goal**: Create a comprehensive project plan document at the root of the project for phased execution in future sessions.

### 0.1 Create Project Plan Markdown
- [x] Create `PROJECT_PLAN.md` at `/Users/rakeshpatole/Documents/SampleWebApp/PROJECT_PLAN.md`
- [x] Include complete project overview, tech stack, and all phases
- [x] Structure as actionable checklist with clear phase boundaries
- [x] Include file structure and verification steps
- [x] Add phase completion criteria for tracking progress

### 0.2 Phase Breakdown Structure
- [x] Document each phase as a standalone unit that can be executed independently
- [x] Include dependencies between phases
- [x] Add checkpoints for verification after each phase
- [x] Provide context for continuing work in future sessions

### 0.3 Git Configuration
- [x] Initialize git repository
- [x] Create `.gitignore` for both client and server
- [x] Add node_modules, dist, build, .env files to .gitignore
- [x] Create initial commit with PROJECT_PLAN.md

**Phase 0 Completion Criteria**:
- [x] PROJECT_PLAN.md exists at project root
- [x] Git repository initialized
- [x] .gitignore configured properly
- [x] Initial commit created

---

## Phase 1: Project Foundation & Infrastructure Setup ✅
**Goal**: Initialize monorepo structure, configure build tools, and set up basic development environment.

### 1.1 Initialize Monorepo Structure
- [x] Create root directory structure with `server/` and `client/` folders
- [x] Initialize package.json files for both client and server
- [x] Set up workspace package configuration (if using workspaces)

### 1.2 Server Configuration
- [x] Initialize Node.js project in `server/` directory
- [x] Install dependencies: express, typescript, @types/express, better-sqlite3, bcrypt, jsonwebtoken, cors, dotenv
- [x] Create `tsconfig.json` with strict TypeScript configuration
- [x] Set up `package.json` scripts (dev, build, start)
- [x] Configure `.env` file for environment variables

### 1.3 Client Configuration
- [x] Initialize React project in `client/` directory with Vite
- [x] Install dependencies: react, react-dom, typescript, @types/react, @types/react-dom
- [x] Install UI dependencies: tailwindcss, @tanstack/react-query, react-router-dom, axios, zod
- [x] Create `vite.config.ts` with TypeScript configuration
- [x] Create `tsconfig.json` with strict TypeScript configuration
- [x] Set up `package.json` scripts (dev, build, preview)
- [x] Configure Tailwind CSS with PostCSS

**Phase 1 Completion Criteria**:
- [x] Both client and server can run in dev mode without errors
- [x] TypeScript compiles successfully in both projects
- [x] Tailwind CSS is configured and working
- [x] Directory structure matches the plan

---

## Phase 2: Backend Foundation - Database & Authentication ✅
**Goal**: Set up SQLite database, implement authentication system, and create basic API structure.

### 2.1 Database Setup
- [x] Install and configure `better-sqlite3`
- [x] Create database connection module in `server/src/database/connection.ts`
- [x] Design database schema for users and tasks tables
- [x] Create migration scripts in `server/src/database/migrations.ts`
- [x] Implement seed data script in `server/src/database/seed.ts`
- [x] Create indexes for performance optimization

### 2.2 Authentication System
- [x] Create JWT utilities in `server/src/utils/jwt.ts`
- [x] Implement password hashing with bcrypt in `server/src/utils/password.ts`
- [x] Create authentication middleware in `server/src/middleware/authMiddleware.ts`
- [x] Implement token refresh logic
- [x] Create error handling middleware in `server/src/middleware/errorMiddleware.ts`

### 2.3 Basic Server Setup
- [x] Create Express server in `server/src/server.ts`
- [x] Configure CORS, body-parser, and security middleware
- [x] Set up environment variable loading with dotenv
- [x] Create health check endpoint
- [x] Configure error handling globally

**Phase 2 Completion Criteria**:
- [x] SQLite database initializes successfully with migrations
- [x] Seed data loads correctly
- [x] JWT token generation and validation works
- [x] Password hashing and verification works
- [x] Server starts without errors on configured port

---

## Phase 3: Backend API Implementation ✅
**Goal**: Implement REST API controllers and routes for authentication, users, and tasks.

### 3.1 Authentication Endpoints
- [x] Create `AuthController` in `server/src/controllers/AuthController.ts`
  - [x] `register` - user registration with password hashing
  - [x] `login` - user authentication with JWT token generation
  - [x] `refresh` - refresh access token
- [x] Create auth routes in `server/src/routes/authRoutes.ts`
  - [x] POST /api/auth/register
  - [x] POST /api/auth/login
  - [x] POST /api/auth/refresh

### 3.2 User Endpoints
- [x] Create `UserController` in `server/src/controllers/UserController.ts`
  - [x] `getCurrentUser` - fetch current user profile
  - [x] `updateProfile` - update user profile
- [x] Create user routes in `server/src/routes/userRoutes.ts`
  - [x] GET /api/users/me
  - [x] PUT /api/users/me

### 3.3 Task Endpoints
- [x] Create `TaskController` in `server/src/controllers/TaskController.ts`
  - [x] `getTasks` - fetch user's tasks with filtering
  - [x] `createTask` - create new task
  - [x] `updateTask` - update task details
  - [x] `deleteTask` - delete task
  - [x] `toggleStatus` - toggle task completion status
- [x] Create task routes in `server/src/routes/taskRoutes.ts`
  - [x] GET /api/tasks
  - [x] POST /api/tasks
  - [x] PUT /api/tasks/:id
  - [x] DELETE /api/tasks/:id
  - [x] PATCH /api/tasks/:id/status

### 3.4 Route Integration
- [x] Integrate all routes in `server/src/server.ts`
- [x] Apply authentication middleware to protected routes
- [x] Add route validation and error handling

**Phase 3 Completion Criteria**:
- [x] All API endpoints respond correctly
- [x] Authentication middleware protects routes properly
- [x] Error handling works for all endpoints
- [x] API can be tested with tools like Postman or curl

---

## Phase 4: Frontend Foundation - Layer Setup
**Goal**: Set up the Clean Architecture layer structure in the frontend and implement foundation utilities.

### 4.1 Foundation Layer - Network
- [ ] Create Axios client singleton in `client/src/foundation/network/axiosClient.ts`
- [ ] Configure base URL, timeout, and interceptors
- [ ] Add request interceptor for JWT token injection
- [ ] Add response interceptor for token refresh and error handling
- [ ] Create network error types and utilities

### 4.2 Foundation Layer - Context
- [ ] Create `AuthContext` in `client/src/foundation/context/AuthContext.tsx`
  - [ ] Manage authentication state (user, token, loading)
  - [ ] Provide login, logout, register functions
  - [ ] Handle token persistence in localStorage
- [ ] Create `ThemeContext` in `client/src/foundation/context/ThemeContext.tsx`
  - [ ] Manage theme state (light/dark)
  - [ ] Provide theme toggle function
- [ ] Create context providers wrapper in `client/src/foundation/context/index.ts`

### 4.3 Foundation Layer - Router
- [ ] Create React Router configuration in `client/src/foundation/router/AppRouter.tsx`
- [ ] Define all application routes
- [ ] Create route guards in `client/src/foundation/router/routeGuards.ts`
  - [ ] ProtectedRoute component for authenticated routes
  - [ ] PublicRoute component for login/register pages
- [ ] Create navigation components (Navbar, Sidebar if needed)

### 4.4 App Entry Points
- [ ] Create `main.tsx` with React.StrictMode and root rendering
- [ ] Create `App.tsx` with Router and Context providers
- [ ] Set up global styles with Tailwind directives

**Phase 4 Completion Criteria**:
- [ ] Axios client configured with interceptors
- [ ] AuthContext manages authentication state correctly
- [ ] ThemeContext toggles between light/dark modes
- [ ] Router renders all defined routes
- [ ] Route guards protect authenticated routes
- [ ] App renders without errors in browser

---

## Phase 5: Domain Layer Implementation
**Goal**: Implement pure business logic layer with domain models and use cases (framework-agnostic).

### 5.1 Domain Models
- [ ] Create `User` model in `client/src/domain/models/User.ts`
  - [ ] id, name, email, avatar, bio, createdAt
  - [ ] Validation methods
- [ ] Create `Task` model in `client/src/domain/models/Task.ts`
  - [ ] id, title, description, status, priority, dueDate, userId, createdAt, updatedAt
  - [ ] Validation methods
- [ ] Create enums in `client/src/domain/models/enums.ts`
  - [ ] TaskStatus: TODO, IN_PROGRESS, COMPLETED
  - [ ] TaskPriority: LOW, MEDIUM, HIGH
- [ ] Create domain model exports in `client/src/domain/models/index.ts`

### 5.2 Use Cases (Interactors)
- [ ] Create `RegisterUserUseCase` in `client/src/domain/useCases/RegisterUserUseCase.ts`
- [ ] Create `LoginUseCase` in `client/src/domain/useCases/LoginUseCase.ts`
- [ ] Create `GetCurrentUserUseCase` in `client/src/domain/useCases/GetCurrentUserUseCase.ts`
- [ ] Create `GetTasksUseCase` in `client/src/domain/useCases/GetTasksUseCase.ts`
- [ ] Create `CreateTaskUseCase` in `client/src/domain/useCases/CreateTaskUseCase.ts`
- [ ] Create `UpdateTaskUseCase` in `client/src/domain/useCases/UpdateTaskUseCase.ts`
- [ ] Create `ToggleTaskStatusUseCase` in `client/src/domain/useCases/ToggleTaskStatusUseCase.ts`
- [ ] Create `DeleteTaskUseCase` in `client/src/domain/useCases/DeleteTaskUseCase.ts`
- [ ] Create use case exports in `client/src/domain/useCases/index.ts`

**Phase 5 Completion Criteria**:
- [ ] All domain models are pure TypeScript with no framework dependencies
- [ ] Use cases are pure functions with no external dependencies
- [ ] Domain models include validation logic
- [ ] TypeScript types are strictly enforced

---

## Phase 6: Data Layer Implementation
**Goal**: Implement data sources, API callers, mappers, and repository implementations.

### 6.1 API Layer
- [ ] Create `AuthApi` in `client/src/data/api/AuthApi.ts`
  - [ ] register(email, password, name)
  - [ ] login(email, password)
  - [ ] refreshToken(refreshToken)
- [ ] Create `UserApi` in `client/src/data/api/UserApi.ts`
  - [ ] getCurrentUser()
  - [ ] updateProfile(data)
- [ ] Create `TaskApi` in `client/src/data/api/TaskApi.ts`
  - [ ] getTasks(filters)
  - [ ] createTask(data)
  - [ ] updateTask(id, data)
  - [ ] deleteTask(id)
  - [ ] toggleTaskStatus(id, status)
- [ ] Create API exports in `client/src/data/api/index.ts`

### 6.2 Mappers & Validation
- [ ] Create Zod schemas in `client/src/data/mappers/schemas.ts`
  - [ ] UserDTO schema
  - [ ] TaskDTO schema
  - [ ] AuthResponse schema
- [ ] Create `UserMapper` in `client/src/data/mappers/UserMapper.ts`
  - [ ] toDomain(dto) - transform API response to domain model
  - [ ] toDTO(domain) - transform domain model to API request
- [ ] Create `TaskMapper` in `client/src/data/mappers/TaskMapper.ts`
  - [ ] toDomain(dto) - transform API response to domain model
  - [ ] toDTO(domain) - transform domain model to API request
- [ ] Create mapper exports in `client/src/data/mappers/index.ts`

### 6.3 Repository Implementations
- [ ] Create `AuthRepository` in `client/src/data/repositories/AuthRepository.ts`
  - [ ] Use TanStack Query for auth state management
  - [ ] Implement register, login, logout mutations
  - [ ] Handle token storage and refresh
- [ ] Create `UserRepository` in `client/src/data/repositories/UserRepository.ts`
  - [ ] Use TanStack Query for user data caching
  - [ ] Implement getCurrentUser query
  - [ ] Implement updateProfile mutation
- [ ] Create `TaskRepository` in `client/src/data/repositories/TaskRepository.ts`
  - [ ] Use TanStack Query for task data caching
  - [ ] Implement getTasks query with filters
  - [ ] Implement createTask, updateTask, deleteTask mutations
  - [ ] Implement toggleTaskStatus mutation
  - [ ] Configure cache invalidation strategies
- [ ] Create repository exports in `client/src/data/repositories/index.ts`

**Phase 6 Completion Criteria**:
- [ ] All API callers use the configured Axios client
- [ ] Zod schemas validate DTOs correctly
- [ ] Mappers transform between DTOs and domain models
- [ ] Repositories use TanStack Query for caching
- [ ] Cache invalidation works correctly after mutations
- [ ] Error states are handled properly

---

## Phase 7: Presentation Layer - Components
**Goal**: Implement reusable UI components following atomic design principles.

### 7.1 Basic UI Components
- [ ] Create `StatusBadge` in `client/src/presentation/components/StatusBadge.tsx`
  - [ ] Display task status with color coding
- [ ] Create `PriorityBadge` in `client/src/presentation/components/PriorityBadge.tsx`
  - [ ] Display task priority with color coding
- [ ] Create `CodeBlock` in `client/src/presentation/components/CodeBlock.tsx`
  - [ ] Display syntax-highlighted code snippets
  - [ ] Support TypeScript and Swift syntax
  - [ ] Add copy-to-clipboard functionality

### 7.2 Task Components
- [ ] Create `TaskCard` in `client/src/presentation/components/TaskCard.tsx`
  - [ ] Display task with title, description, status, priority
  - [ ] Include action buttons (edit, delete, toggle status)
  - [ ] Handle loading and error states
- [ ] Create `TaskForm` in `client/src/presentation/components/TaskForm.tsx`
  - [ ] Form for creating/editing tasks
  - [ ] Include validation
  - [ ] Handle submission with loading state

### 7.3 User Components
- [ ] Create `UserProfileCard` in `client/src/presentation/components/UserProfileCard.tsx`
  - [ ] Display user profile with avatar, name, bio
  - [ ] Include edit button
  - [ ] Handle loading and error states

### 7.4 Comparison Components
- [ ] Create `ComparisonPanel` in `client/src/presentation/components/ComparisonPanel.tsx`
  - [ ] Side-by-side code comparison layout
  - [ ] Toggle between TypeScript and Swift views
  - [ ] Highlight architectural patterns
- [ ] Create `LayerMap` in `client/src/presentation/components/LayerMap.tsx`
  - [ ] Visual diagram showing layer relationships
  - [ ] Interactive clickable layers
  - [ ] Show data flow visualization

### 7.5 Component Exports
- [ ] Create `client/src/presentation/components/index.ts` with all component exports

**Phase 7 Completion Criteria**:
- [ ] All components render correctly
- [ ] Components handle loading and error states
- [ ] Form validation works correctly
- [ ] Code highlighting displays correctly
- [ ] Comparison panel toggles between views
- [ ] Components are reusable and follow atomic design

---

## Phase 8: Presentation Layer - Hooks (ViewModels)
**Goal**: Implement custom hooks that act as ViewModels/Presenters, encapsulating view logic.

### 8.1 Authentication ViewModel
- [ ] Create `useAuthViewModel` in `client/src/presentation/hooks/useAuthViewModel.ts`
  - [ ] Manage authentication state
  - [ ] Provide login, register, logout functions
  - [ ] Handle loading and error states
  - [ ] Integrate with AuthRepository

### 8.2 User ViewModel
- [ ] Create `useUserViewModel` in `client/src/presentation/hooks/useUserViewModel.ts`
  - [ ] Manage user profile state
  - [ ] Provide updateProfile function
  - [ ] Handle loading and error states
  - [ ] Integrate with UserRepository

### 8.3 Task List ViewModel
- [ ] Create `useTaskListViewModel` in `client/src/presentation/hooks/useTaskListViewModel.ts`
  - [ ] Manage task list state
  - [ ] Provide filtering by status and priority
  - [ ] Provide refresh function
  - [ ] Handle loading and error states
  - [ ] Integrate with TaskRepository

### 8.4 Task Form ViewModel
- [ ] Create `useTaskFormViewModel` in `client/src/presentation/hooks/useTaskFormViewModel.ts`
  - [ ] Manage form state (title, description, priority, dueDate)
  - [ ] Provide validation
  - [ ] Handle create and update operations
  - [ ] Handle loading and error states
  - [ ] Integrate with TaskRepository

### 8.5 Comparison ViewModel
- [ ] Create `useComparisonViewModel` in `client/src/presentation/hooks/useComparisonViewModel.ts`
  - [ ] Manage selected layer for comparison
  - [ ] Manage code snippet display state
  - [ ] Provide toggle between TypeScript and Swift
  - [ ] Handle interactive layer selection

### 8.6 Hook Exports
- [ ] Create `client/src/presentation/hooks/index.ts` with all hook exports

**Phase 8 Completion Criteria**:
- [ ] All hooks manage state correctly
- [ ] Hooks integrate with repositories properly
- [ ] Loading and error states are handled
- [ ] Form validation works correctly
- [ ] Hooks are reusable across components

---

## Phase 9: Presentation Layer - Screens
**Goal**: Implement route-level screens that compose components and use ViewModels.

### 9.1 Authentication Screens
- [ ] Create `LoginScreen` in `client/src/presentation/screens/LoginScreen.tsx`
  - [ ] Login form with email and password
  - [ ] Integrate with useAuthViewModel
  - [ ] Handle form submission and errors
  - [ ] Link to registration page
- [ ] Create `RegisterScreen` in `client/src/presentation/screens/RegisterScreen.tsx`
  - [ ] Registration form with name, email, password
  - [ ] Integrate with useAuthViewModel
  - [ ] Handle form submission and errors
  - [ ] Link to login page

### 9.2 Dashboard Screen
- [ ] Create `DashboardScreen` in `client/src/presentation/screens/DashboardScreen.tsx`
  - [ ] Display task overview and statistics
  - [ ] Show quick actions (create task, view all tasks)
  - [ ] Display recent tasks
  - [ ] Integrate with useTaskListViewModel
  - [ ] Navigate to task list and profile

### 9.3 Profile Screen
- [ ] Create `ProfileScreen` in `client/src/presentation/screens/ProfileScreen.tsx`
  - [ ] Display user profile with UserProfileCard
  - [ ] Allow profile editing
  - [ ] Integrate with useUserViewModel
  - [ ] Handle logout action

### 9.4 Task List Screen
- [ ] Create `TaskListScreen` in `client/src/presentation/screens/TaskListScreen.tsx`
  - [ ] Display all tasks with TaskCard components
  - [ ] Provide filtering by status and priority
  - [ ] Include create task button/form
  - [ ] Integrate with useTaskListViewModel and useTaskFormViewModel
  - [ ] Handle task actions (edit, delete, toggle status)

### 9.5 Comparison Screen
- [ ] Create `ComparisonScreen` in `client/src/presentation/screens/ComparisonScreen.tsx`
  - [ ] Display layer map with LayerMap component
  - [ ] Show comparison panels with ComparisonPanel
  - [ ] Display code snippets with CodeBlock
  - [ ] Integrate with useComparisonViewModel
  - [ ] Provide interactive layer selection

### 9.6 Screen Exports
- [ ] Create `client/src/presentation/screens/index.ts` with all screen exports

**Phase 9 Completion Criteria**:
- [ ] All screens render correctly
- [ ] Navigation between screens works
- [ ] Forms submit data correctly
- [ ] Auth screens redirect after successful login/register
- [ ] Protected screens redirect to login if not authenticated
- [ ] Comparison screen displays all layers correctly

---

## Phase 10: iOS vs Web Comparison Content
**Goal**: Create comprehensive TypeScript vs Swift code comparisons for each architectural layer.

### 10.1 Foundation Layer Comparisons
- [ ] Create code snippets for:
  - [ ] Axios client vs URLSession configuration
  - [ ] AuthContext vs @Environment(AuthManager)
  - [ ] React Router vs Coordinator pattern
  - [ ] ThemeContext vs @Environment(\.colorScheme)

### 10.2 Domain Layer Comparisons
- [ ] Create code snippets for:
  - [ ] Domain models (TypeScript interfaces vs Swift structs)
  - [ ] Use cases (TypeScript functions vs Swift Interactor classes)
  - [ ] Enums (TypeScript enums vs Swift enums)

### 10.3 Data Layer Comparisons
- [ ] Create code snippets for:
  - [ ] API callers (Axios vs URLSession)
  - [ ] Mappers (TypeScript functions vs Codable)
  - [ ] Repositories (TanStack Query vs Combine publishers)
  - [ ] Zod schemas vs Codable

### 10.4 Presentation Layer Comparisons
- [ ] Create code snippets for:
  - [ ] Custom hooks (useTaskViewModel) vs ObservableObject (TaskViewModel)
  - [ ] Components (TaskCard) vs SwiftUI Views (TaskView)
  - [ ] Screens (TaskListScreen) vs ViewControllers (TaskListViewController)
  - [ ] Route guards vs Coordinator navigation logic

### 10.5 Comparison Data Structure
- [ ] Create `client/src/data/comparisonData.ts` with all comparison content
- [ ] Structure as layer → concept → {typescript, swift, explanation}
- [ ] Include annotations highlighting architectural similarities
- [ ] Add learning notes for each comparison

**Phase 10 Completion Criteria**:
- [ ] All layers have comparison content
- [ ] Code snippets are accurate and idiomatic
- [ ] Explanations clearly show architectural parallels
- [ ] Comparison data is structured for easy rendering

---

## Phase 11: Integration & Polish
**Goal**: Integrate all components, add styling, and polish the UI.

### 11.1 Styling & Design
- [ ] Configure Tailwind custom theme in `tailwind.config.js`
  - [ ] iOS-inspired color palette
  - [ ] Custom spacing and typography
  - [ ] Dark mode color scheme
- [ ] Apply consistent styling across all components
- [ ] Add smooth transitions and animations
- [ ] Ensure responsive design (mobile-first)

### 11.2 Error Handling & Loading States
- [ ] Add global error boundary in App.tsx
- [ ] Create error page component
- [ ] Create loading spinner component
- [ ] Add toast notifications for user feedback
- [ ] Handle network errors gracefully

### 11.3 Accessibility
- [ ] Add ARIA labels to interactive elements
- [ ] Ensure keyboard navigation works
- [ ] Add focus states for interactive elements
- [ ] Test with screen reader compatibility

### 11.4 Performance Optimization
- [ ] Implement code splitting with React.lazy
- [ ] Optimize bundle size
- [ ] Add image optimization
- [ ] Implement proper caching strategies

**Phase 11 Completion Criteria**:
- [ ] UI is visually consistent and polished
- [ ] Dark mode works correctly
- [ ] Responsive design works on mobile and desktop
- [ ] Error handling is comprehensive
- [ ] Loading states provide good UX
- [ ] Accessibility requirements are met

---

## Phase 12: Testing & Verification
**Goal**: Test the complete application and verify all functionality works correctly.

### 12.1 Backend Testing
- [ ] Test all API endpoints with Postman or curl
- [ ] Verify authentication flow (register → login → token refresh)
- [ ] Test protected routes with valid and invalid tokens
- [ ] Verify database operations (CRUD for users and tasks)
- [ ] Test error handling for invalid requests

### 12.2 Frontend Testing
- [ ] Test complete user flow:
  - [ ] Register new user
  - [ ] Login with credentials
  - [ ] View profile
  - [ ] Create, edit, delete tasks
  - [ ] Toggle task status
  - [ ] Filter tasks
  - [ ] Logout
- [ ] Test authentication guards (protected routes redirect)
- [ ] Test error handling (network errors, validation errors)
- [ ] Test dark mode toggle
- [ ] Test comparison screen functionality

### 12.3 Integration Testing
- [ ] Start both server and client
- [ ] Verify frontend connects to backend API
- [ ] Test real-time data updates
- [ ] Verify TanStack Query caching works
- [ ] Test token refresh on expiration

### 12.4 Code Quality
- [ ] Run TypeScript type checking on both client and server
- [ ] Fix any type errors
- [ ] Run ESLint if configured
- [ ] Check for console errors in browser
- [ ] Verify no console warnings

**Phase 12 Completion Criteria**:
- [ ] All API endpoints work correctly
- [ ] Complete user flow works end-to-end
- [ ] Authentication works correctly
- [ ] Error handling is comprehensive
- [ ] No TypeScript errors
- [ ] No console errors or warnings
- [ ] Application is production-ready for local development

---

## Complete File Structure

```
my-learning-app/
├── PROJECT_PLAN.md                          # <-- Phase 0 creates this
├── .gitignore                               # <-- Phase 0.3 creates this
├── server/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── src/
│       ├── controllers/
│       │   ├── AuthController.ts
│       │   ├── UserController.ts
│       │   └── TaskController.ts
│       ├── routes/
│       │   ├── authRoutes.ts
│       │   ├── userRoutes.ts
│       │   └── taskRoutes.ts
│       ├── middleware/
│       │   ├── authMiddleware.ts
│       │   └── errorMiddleware.ts
│       ├── database/
│       │   ├── connection.ts
│       │   ├── migrations.ts
│       │   └── seed.ts
│       ├── utils/
│       │   ├── jwt.ts
│       │   └── password.ts
│       └── server.ts
│
└── client/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── foundation/
        │   ├── network/
        │   │   └── axiosClient.ts
        │   ├── context/
        │   │   ├── AuthContext.tsx
        │   │   ├── ThemeContext.tsx
        │   │   └── index.ts
        │   └── router/
        │       ├── AppRouter.tsx
        │       ├── routeGuards.ts
        │       └── index.ts
        ├── domain/
        │   ├── models/
        │   │   ├── User.ts
        │   │   ├── Task.ts
        │   │   ├── enums.ts
        │   │   └── index.ts
        │   └── useCases/
        │       ├── RegisterUserUseCase.ts
        │       ├── LoginUseCase.ts
        │       ├── GetCurrentUserUseCase.ts
        │       ├── GetTasksUseCase.ts
        │       ├── CreateTaskUseCase.ts
        │       ├── UpdateTaskUseCase.ts
        │       ├── ToggleTaskStatusUseCase.ts
        │       ├── DeleteTaskUseCase.ts
        │       └── index.ts
        ├── data/
        │   ├── api/
        │   │   ├── AuthApi.ts
        │   │   ├── UserApi.ts
        │   │   ├── TaskApi.ts
        │   │   └── index.ts
        │   ├── mappers/
        │   │   ├── UserMapper.ts
        │   │   ├── TaskMapper.ts
        │   │   ├── schemas.ts
        │   │   └── index.ts
        │   ├── repositories/
        │   │   ├── AuthRepository.ts
        │   │   ├── UserRepository.ts
        │   │   ├── TaskRepository.ts
        │   │   └── index.ts
        │   └── comparisonData.ts
        ├── presentation/
        │   ├── screens/
        │   │   ├── LoginScreen.tsx
        │   │   ├── RegisterScreen.tsx
        │   │   ├── DashboardScreen.tsx
        │   │   ├── ProfileScreen.tsx
        │   │   ├── TaskListScreen.tsx
        │   │   ├── ComparisonScreen.tsx
        │   │   └── index.ts
        │   ├── components/
        │   │   ├── TaskCard.tsx
        │   │   ├── TaskForm.tsx
        │   │   ├── UserProfileCard.tsx
        │   │   ├── StatusBadge.tsx
        │   │   ├── PriorityBadge.tsx
        │   │   ├── ComparisonPanel.tsx
        │   │   ├── CodeBlock.tsx
        │   │   ├── LayerMap.tsx
        │   │   └── index.ts
        │   └── hooks/
        │       ├── useAuthViewModel.ts
        │       ├── useUserViewModel.ts
        │       ├── useTaskListViewModel.ts
        │       ├── useTaskFormViewModel.ts
        │       ├── useComparisonViewModel.ts
        │       └── index.ts
        ├── App.tsx
        └── main.tsx
```

---

## Phase Dependencies
- Phase 0: No dependencies
- Phase 1: No dependencies
- Phase 2: Depends on Phase 1
- Phase 3: Depends on Phase 2
- Phase 4: Depends on Phase 1
- Phase 5: Depends on Phase 4
- Phase 6: Depends on Phase 5
- Phase 7: Depends on Phase 6
- Phase 8: Depends on Phase 6 and 7
- Phase 9: Depends on Phase 7 and 8
- Phase 10: Can be done in parallel with Phase 7-9
- Phase 11: Depends on Phase 9 and 10
- Phase 12: Depends on Phase 11

---

## Instructions for Phased Execution
Each phase can be executed independently in a separate chat session:
1. Start a new chat session
2. Reference the PROJECT_PLAN.md file at the root
3. Execute the specific phase's tasks
4. Mark completion in the PROJECT_PLAN.md file (change `[ ]` to `[x]`)
5. Continue to next phase in another session if needed

---

## Key Architectural Principles
1. **Strict Layer Separation**: No layer can import from a layer above it
2. **Dependency Inversion**: Domain layer has no dependencies on Data or Presentation
3. **Framework Agnostic Domain**: Domain models and use cases are pure TypeScript
4. **Repository Pattern**: Data layer abstracts data sources via repositories
5. **ViewModel Pattern**: Custom hooks encapsulate view logic like iOS ViewModels
6. **Single Responsibility**: Each file/class has one clear purpose
