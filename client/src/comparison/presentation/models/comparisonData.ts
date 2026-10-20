export interface ComparisonConcept {
  name: string;
  typescript: string;
  swift: string;
  explanation: string;
  learningNotes?: string[];
}

export interface ComparisonLayer {
  name: string;
  concepts: Record<string, ComparisonConcept>;
}

export const comparisonData: Record<string, ComparisonLayer> = {
  Foundation: {
    name: 'Foundation',
    concepts: {
      'Axios Client': {
        name: 'Axios Client',
        typescript: `// Axios client singleton with interceptors
import axios, { AxiosError } from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: add JWT token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// Response interceptor: handle token refresh
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Refresh token logic
    }
    return Promise.reject(error);
  }
);

export default axiosClient;`,
        swift: `// URLSession configuration with interceptors
class NetworkClient {
    private let session: URLSession
    private let baseURL: String

    init(baseURL: String) {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 10
        config.httpAdditionalHeaders = [
            "Content-Type": "application/json"
        ]
        self.session = URLSession(configuration: config)
        self.baseURL = baseURL
    }

    // Request interceptor: add JWT token
    func request<T: Decodable>(
        endpoint: String,
        method: String = "GET"
    ) async throws -> T {
        var request = URLRequest(url: URL(string: baseURL + endpoint)!)
        request.httpMethod = method

        if let token = UserDefaults.standard.string(forKey: "accessToken") {
            request.setValue("Bearer \\(token)", forHTTPHeaderField: "Authorization")
        }

        let (data, _) = try await session.data(for: request)
        return try JSONDecoder().decode(T.self, from: data)
    }
}`,
        explanation: 'Both provide centralized HTTP client configuration with interceptors for authentication and error handling.',
        learningNotes: [
          'Axios uses interceptors for request/response transformation',
          'URLSession uses configuration and delegate methods',
          'Both handle JWT token injection and refresh',
          'Both support request/response logging and error handling',
        ],
      },
      AuthContext: {
        name: 'AuthContext',
        typescript: `// React Context for dependency injection
import { createContext, useContext, useState } from 'react';
import type { Account } from '../../domain/models';

interface AuthContextType {
  user: Account | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<Account | null>(null);

  const login = async (email: string, password: string) => {
    // Auth logic
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}`,
        swift: `// iOS Environment for dependency injection
import SwiftUI

@MainActor
class AuthManager: ObservableObject {
    @Published var user: User?
    @Published var isAuthenticated: Bool = false

    func login(email: String, password: String) async throws {
        // Auth logic
    }

    func logout() {
        user = nil
        isAuthenticated = false
        UserDefaults.standard.removeObject(forKey: "accessToken")
    }
}

// In App delegate or Scene delegate
@main
struct MyApp: App {
    @StateObject private var authManager = AuthManager()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authManager)
        }
    }
}

// Usage in a view
struct LoginView: View {
    @EnvironmentObject var authManager: AuthManager

    var body: some View {
        Button("Login") {
            Task {
                try? await authManager.login(email: "...", password: "...")
            }
        }
    }
}`,
        explanation: 'Both provide global state management and dependency injection for authentication state across the app.',
        learningNotes: [
          'React Context provides component-level DI',
          '@EnvironmentObject provides app-level DI in SwiftUI',
          'Both use reactive state (@Published, useState)',
          'Both wrap the app with a provider',
        ],
      },
      'React Router': {
        name: 'React Router',
        typescript: `// React Router configuration with route guards
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginScreen /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><TaskListScreen /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}`,
        swift: `// iOS Coordinator pattern with UINavigationController
import UIKit

class AppCoordinator: Coordinator {
    var navigationController: UINavigationController

    init(navigationController: UINavigationController) {
        self.navigationController = navigationController
    }

    func start() {
        showLogin()
    }

    func showLogin() {
        let viewModel = LoginViewModel(coordinator: self)
        let viewController = LoginViewController(viewModel: viewModel)
        navigationController.pushViewController(viewController, animated: false)
    }

    func showDashboard() {
        let viewModel = DashboardViewModel(coordinator: self)
        let viewController = DashboardViewController(viewModel: viewModel)
        navigationController.setViewControllers([viewController], animated: true)
    }

    func showTasks() {
        let viewModel = TaskListViewModel(coordinator: self)
        let viewController = TaskListViewController(viewModel: viewModel)
        navigationController.pushViewController(viewController, animated: true)
    }
}`,
        explanation: 'Both handle navigation and route protection. React Router uses declarative routes with guards, while iOS uses the Coordinator pattern with UINavigationController.',
        learningNotes: [
          'React Router is declarative with JSX routes',
          'Coordinator is imperative with programmatic navigation',
          'Both implement route guards for protected content',
          'Both support deep linking and navigation state',
        ],
      },
      ThemeContext: {
        name: 'ThemeContext',
        typescript: `// React Context for theme management
import { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved as Theme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}`,
        swift: `// iOS Environment for theme
import SwiftUI

@MainActor
class ThemeManager: ObservableObject {
    @Published var colorScheme: ColorScheme = .light

    init() {
        // Check system preference
        self.colorScheme = UITraitCollection.current.userInterfaceStyle == .dark ? .dark : .light
    }

    func toggle() {
        colorScheme = colorScheme == .light ? .dark : .light
    }
}

// Usage in view
struct ContentView: View {
    @EnvironmentObject var themeManager: ThemeManager

    var body: some View {
        Text("Hello")
            .foregroundColor(themeManager.colorScheme == .dark ? .white : .black)
            .preferredColorScheme(themeManager.colorScheme)
    }
}`,
        explanation: 'Both manage global theme state and apply it to the UI. React uses Context and CSS classes, while iOS uses @EnvironmentObject and ColorScheme.',
        learningNotes: [
          'React applies theme via CSS classes on document',
          'iOS uses preferredColorScheme and system colors',
          'Both persist theme preference',
          'Both respect system preference as default',
        ],
      },
    },
  },
  Domain: {
    name: 'Domain',
    concepts: {
      'Models': {
        name: 'Models',
        typescript: `// Domain model (pure TypeScript)
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
}

export class UserModel implements User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public avatar?: string,
    public bio?: string,
    public createdAt?: string
  ) {}

  isValid(): boolean {
    return this.id.length > 0 && this.name.length > 0 && this.email.length > 0;
  }
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  userId: string;
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}`,
        swift: `// iOS Domain model (Swift struct)
import Foundation

struct User {
    let id: String
    let name: String
    let email: String
    let avatar: String?
    let bio: String?
    let createdAt: Date?

    func isValid() -> Bool {
        return !id.isEmpty && !name.isEmpty && !email.isEmpty
    }
}

struct Task {
    let id: String
    let title: String
    let status: TaskStatus
    let priority: TaskPriority
    let userId: String
}

enum TaskStatus: String, Codable {
    case todo = "TODO"
    case inProgress = "IN_PROGRESS"
    case completed = "COMPLETED"
}

enum TaskPriority: String, Codable {
    case low = "LOW"
    case medium = "MEDIUM"
    case high = "HIGH"
}`,
        explanation: 'Both define pure data structures with no framework dependencies. TypeScript uses interfaces and classes, while Swift uses structs and enums.',
        learningNotes: [
          'TypeScript interfaces are compile-time only',
          'Swift structs are value types (copy-on-write)',
          'Both support enums for constrained values',
          'Both include validation methods',
        ],
      },
      'Use Cases': {
        name: 'Use Cases',
        typescript: `// Use case (interactor) - pure function
import type { Task } from '../models';
import type { TaskStatus } from '../models';

export interface GetTasksInput {
  status?: TaskStatus;
  priority?: string;
}

export async function getTasksUseCase(input?: GetTasksInput): Promise<Task[]> {
  // Business logic: fetch tasks from repository
  const tasks = await taskRepository.getTasks(input);

  // Business logic: filter, sort, validate
  return tasks.filter(task => task.isValid());
}

export async function createTaskUseCase(input: CreateTaskInput): Promise<Task> {
  if (!input.title || input.title.trim().length === 0) {
    throw new Error('Title is required');
  }

  const task = await taskRepository.createTask(input);
  return task;
}`,
        swift: `// iOS Interactor - pure class/protocol
import Foundation

protocol GetTasksUseCaseProtocol {
    func execute(status: TaskStatus?, priority: TaskPriority?) async throws -> [Task]
}

class GetTasksUseCase: GetTasksUseCaseProtocol {
    private let repository: TaskRepositoryProtocol

    init(repository: TaskRepositoryProtocol) {
        self.repository = repository
    }

    func execute(status: TaskStatus? = nil, priority: TaskPriority? = nil) async throws -> [Task] {
        let tasks = try await repository.fetchTasks(status: status, priority: priority)
        return tasks.filter { $0.isValid() }
    }
}

protocol CreateTaskUseCaseProtocol {
    func execute(input: CreateTaskInput) async throws -> Task
}

class CreateTaskUseCase: CreateTaskUseCaseProtocol {
    private let repository: TaskRepositoryProtocol

    init(repository: TaskRepositoryProtocol) {
        self.repository = repository
    }

    func execute(input: CreateTaskInput) async throws -> Task {
        guard !input.title.trimmingCharacters(in: .whitespaces).isEmpty else {
            throw ValidationError.invalidTitle
        }
        return try await repository.createTask(input)
    }
}`,
        explanation: 'Both encapsulate business logic in pure functions/classes that are framework-agnostic and testable.',
        learningNotes: [
          'TypeScript uses async functions',
          'Swift uses async/await with protocols',
          'Both are pure functions with no side effects',
          'Both validate inputs and business rules',
        ],
      },
      'Enums': {
        name: 'Enums',
        typescript: `// TypeScript enums for domain constraints
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

// Type-safe usage
function updateTaskStatus(task: Task, status: TaskStatus) {
  task.status = status; // Only valid TaskStatus values allowed
}

// String literal union type (alternative)
export type TaskStatusUnion = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';`,
        swift: `// Swift enums for domain constraints
import Foundation

enum TaskStatus: String, Codable, CaseIterable {
    case todo = "TODO"
    case inProgress = "IN_PROGRESS"
    case completed = "COMPLETED"
}

enum TaskPriority: String, Codable, CaseIterable {
    case low = "LOW"
    case medium = "MEDIUM"
    case high = "HIGH"
}

// Type-safe usage
func updateTaskStatus(task: inout Task, status: TaskStatus) {
    task.status = status // Only valid TaskStatus values allowed
}`,
        explanation: 'Both use enums to define constrained sets of values for domain concepts.',
        learningNotes: [
          'TypeScript enums can be string or numeric',
          'Swift enums are always string/raw value based',
          'Both provide type safety',
          'Swift has Codable conformance for serialization',
        ],
      },
    },
  },
  Data: {
    name: 'Data',
    concepts: {
      'API Layer': {
        name: 'API Layer',
        typescript: `// API layer - REST API callers (tasks/data/api/TaskApi.ts)
import type { AxiosInstance } from 'axios';
import type { TaskDTO } from '../dtos';
import { TaskStatus } from '../../domain/models';

export function createTaskApi(client: AxiosInstance) {
  return {
    async getTasks(input?: GetTasksInput): Promise<TaskDTO[]> {
      const params = new URLSearchParams();
      if (input?.status) params.append('status', input.status);
      if (input?.priority) params.append('priority', input.priority);

      const response = await client.get<TaskDTO[]>(\`/tasks?\${params.toString()}\`);
      return response.data;
    },

    async createTask(input: CreateTaskInput): Promise<TaskDTO> {
      const response = await client.post<TaskDTO>('/tasks', input);
      return response.data;
    },

    async updateTask(id: string, input: UpdateTaskInput): Promise<TaskDTO> {
      const response = await client.put<TaskDTO>(\`/tasks/\${id}\`, input);
      return response.data;
    },

    async deleteTask(id: string): Promise<void> {
      await client.delete(\`/tasks/\${id}\`);
    },

    async toggleTaskStatus(id: string, status: TaskStatus): Promise<TaskDTO> {
      const response = await client.patch<TaskDTO>(\`/tasks/\${id}/status\`, { status });
      return response.data;
    },
  };
}`,
        swift: `// iOS API layer - URLSession callers
import Foundation

protocol TaskAPIProtocol {
    func fetchTasks(status: TaskStatus?, priority: TaskPriority?) async throws -> [TaskDTO]
    func createTask(input: CreateTaskInput) async throws -> TaskDTO
    func updateTask(id: String, input: UpdateTaskInput) async throws -> TaskDTO
    func deleteTask(id: String) async throws
    func toggleTaskStatus(id: String, status: TaskStatus) async throws -> TaskDTO
}

class TaskAPI: TaskAPIProtocol {
    private let session: URLSession
    private let baseURL: String

    init(session: URLSession = .shared, baseURL: String) {
        self.session = session
        self.baseURL = baseURL
    }

    func fetchTasks(status: TaskStatus? = nil, priority: TaskPriority? = nil) async throws -> [TaskDTO] {
        var components = URLComponents(string: baseURL + "/tasks")!
        var queryItems: [URLQueryItem] = []

        if let status = status {
            queryItems.append(URLQueryItem(name: "status", value: status.rawValue))
        }
        if let priority = priority {
            queryItems.append(URLQueryItem(name: "priority", value: priority.rawValue))
        }

        components.queryItems = queryItems

        let (data, _) = try await session.data(from: components.url!)
        return try JSONDecoder().decode([TaskDTO].self, from: data)
    }

    func createTask(input: CreateTaskInput) async throws -> TaskDTO {
        var request = URLRequest(url: URL(string: baseURL + "/tasks")!)
        request.httpMethod = "POST"
        request.httpBody = try JSONEncoder().encode(input)

        let (data, _) = try await session.data(for: request)
        return try JSONDecoder().decode(TaskDTO.self, from: data)
    }

    // ... other methods
}`,
        explanation: 'Both provide abstraction for HTTP API calls. TypeScript uses Axios, while iOS uses URLSession with async/await.',
        learningNotes: [
          'Axios provides promise-based API',
          'URLSession uses async/await and structured concurrency',
          'Both handle JSON encoding/decoding',
          'Both support query parameters and request bodies',
        ],
      },
      'Mappers': {
        name: 'Mappers',
        typescript: `// Mappers - DTO to Domain transformation (tasks/data/mappers/TaskMapper.ts)
import { taskSchema } from '../dtos/schemas';
import type { Task } from '../../domain/models';
import { TaskModel } from '../../domain/models';

export interface TaskDTO {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export function toDomain(dto: TaskDTO): Task {
  // Transform snake_case to camelCase
  const domainData = {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    status: dto.status as TaskStatus,
    priority: dto.priority as TaskPriority,
    dueDate: dto.due_date,
    userId: dto.user_id,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };

  const validated = taskSchema.parse(domainData);
  return new TaskModel(
    validated.id,
    validated.title,
    validated.status,
    validated.priority,
    validated.userId,
    validated.description,
    validated.dueDate,
    validated.createdAt,
    validated.updatedAt
  );
}`,
        swift: `// iOS Mappers - Codable for DTO to Domain transformation
import Foundation

struct TaskDTO: Codable {
    let id: String
    let title: String
    let description: String?
    let status: String
    let priority: String
    let dueDate: String?  // maps to due_date
    let userId: String     // maps to user_id
    let createdAt: String? // maps to created_at
    let updatedAt: String? // maps to updated_at

    enum CodingKeys: String, CodingKey {
        case id, title, description, status, priority
        case dueDate = "due_date"
        case userId = "user_id"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

extension TaskDTO {
    func toDomain() -> Task {
        Task(
            id: id,
            title: title,
            status: TaskStatus(rawValue: status) ?? .todo,
            priority: TaskPriority(rawValue: priority) ?? .medium,
            userId: userId,
            description: description,
            dueDate: dueDate,
            createdAt: createdAt,
            updatedAt: updatedAt
        )
    }
}`,
        explanation: 'Both handle data transformation between API DTOs and domain models. TypeScript uses manual mapping with Zod validation, while iOS uses Codable with custom CodingKeys.',
        learningNotes: [
          'TypeScript uses Zod for runtime validation',
          'Swift uses Codable for serialization',
          'Both handle snake_case to camelCase conversion',
          'Both provide type-safe transformation',
        ],
      },
      'Repository': {
        name: 'Repository',
        typescript: `// Repository pattern with TanStack Query (tasks/data/repositories/)
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../../foundation/network/axiosClient';
import { createTaskApi } from '../api';
import { toDomain } from '../mappers';
import type { GetTasksInput } from '../../domain/models';
import type { TaskStatus } from '../../domain/models';

const taskApi = createTaskApi(axiosClient);

export function useTaskRepository() {
  const queryClient = useQueryClient();

  const useGetTasksQuery = (input?: GetTasksInput) =>
    useQuery({
      queryKey: ['tasks', input?.status, input?.priority],
      queryFn: async () => {
        const dtos = await taskApi.getTasks(input);
        return dtos.map(toDomain);
      },
    });

  const useCreateTaskMutation = () =>
    useMutation({
      mutationFn: async (input: CreateTaskInput) => {
        const response = await taskApi.createTask(input);
        return toDomain(response);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      },
    });

  return {
    useGetTasksQuery,
    useCreateTaskMutation,
    // ... other mutations
  };
}`,
        swift: `// iOS Repository pattern with Combine publishers
import Combine
import Foundation

protocol TaskRepositoryProtocol {
    func fetchTasks(status: TaskStatus?, priority: TaskPriority?) async throws -> [Task]
    func createTask(input: CreateTaskInput) async throws -> Task
    func updateTask(id: String, input: UpdateTaskInput) async throws -> Task
    func deleteTask(id: String) async throws
    func toggleTaskStatus(id: String, status: TaskStatus) async throws -> Task
}

class TaskRepository: TaskRepositoryProtocol {
    private let api: TaskAPIProtocol
    private let cache = TaskCache()

    init(api: TaskAPIProtocol) {
        self.api = api
    }

    func fetchTasks(status: TaskStatus? = nil, priority: TaskPriority? = nil) async throws -> [Task] {
        // Try cache first
        if let cached = cache.get(status: status, priority: priority) {
            return cached
        }

        // Fetch from API
        let dtos = try await api.fetchTasks(status: status, priority: priority)
        let tasks = dtos.map { $0.toDomain() }

        // Cache result
        cache.set(tasks, status: status, priority: priority)

        return tasks
    }

    func createTask(input: CreateTaskInput) async throws -> Task {
        let dto = try await api.createTask(input: input)
        let task = dto.toDomain()
        cache.invalidate()
        return task
    }

    // ... other methods
}`,
        explanation: 'Both abstract data sources behind repository interfaces. TypeScript uses TanStack Query for caching, while iOS uses protocols with local caching.',
        learningNotes: [
          'TanStack Query handles caching, invalidation, and refetching',
          'iOS repositories manage local cache manually',
          'Both provide clean API for data access',
          'Both support offline/optimistic updates',
        ],
      },
      'Zod Schemas': {
        name: 'Zod Schemas',
        typescript: `// Zod schemas for runtime validation
import { z } from 'zod';
import { TaskStatus, TaskPriority } from '../../domain/models';

export const userSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  createdAt: z.string().optional(),
});

export const taskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  dueDate: z.string().optional(),
  userId: z.string().min(1),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const authResponseSchema = z.object({
  user: userSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
});`,
        swift: `// iOS Codable for serialization and validation
import Foundation

struct UserDTO: Codable {
    let id: String
    let name: String
    let email: String
    let avatar: String?
    let bio: String?
    let createdAt: String?

    enum CodingKeys: String, CodingKey {
        case id, name, email, avatar, bio
        case createdAt = "created_at"
    }
}

struct TaskDTO: Codable {
    let id: String
    let title: String
    let description: String?
    let status: String
    let priority: String
    let dueDate: String?
    let userId: String
    let createdAt: String?
    let updatedAt: String?

    enum CodingKeys: String, CodingKey {
        case id, title, description, status, priority
        case dueDate = "due_date"
        case userId = "user_id"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }

    // Validation
    func validate() throws {
        guard !id.isEmpty else { throw ValidationError.invalidID }
        guard !title.isEmpty else { throw ValidationError.invalidTitle }
        guard !userId.isEmpty else { throw ValidationError.invalidUserID }
    }
}`,
        explanation: 'Both provide runtime validation for data. TypeScript uses Zod schemas, while iOS uses Codable with custom validation methods.',
        learningNotes: [
          'Zod provides declarative schema validation',
          'Codable provides automatic JSON encoding/decoding',
          'Both validate data structure at runtime',
          'Both handle optional fields and enums',
        ],
      },
    },
  },
  Presentation: {
    name: 'Presentation',
    concepts: {
      'Custom Hooks': {
        name: 'Custom Hooks',
        typescript: `// Custom hook (ViewModel pattern) - consumes feature-owned context
import { useTaskUseCases } from '../context';
import type { TaskStatus } from '../../domain/models';
import type { Task } from '../../domain/models';

export function useTaskListViewModel() {
  const taskUseCases = useTaskUseCases();

  const tasksQuery = taskUseCases.useTasksQuery({});

  const createTask = async (input: CreateTaskInput) => {
    return await taskUseCases.createTask(input);
  };

  return {
    tasks: tasksQuery.data as Task[] | undefined,
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error,
    createTask,
    isCreating: taskUseCases.isCreating,
  };
}

// Usage in component
function TaskListScreen() {
  const { tasks, isLoading, createTask } = useTaskListViewModel();

  return (
    <div>
      {isLoading ? <Spinner /> : tasks?.map(task => <TaskCard key={task.id} task={task} />)}
      <button onClick={() => createTask({ title: 'New Task' })}>Create</button>
    </div>
  );
}`,
        swift: `// iOS ViewModel with ObservableObject
import Combine
import Foundation

@MainActor
class TaskListViewModel: ObservableObject {
    @Published var tasks: [Task] = []
    @Published var isLoading: Bool = false
    @Published var error: Error?

    private let repository: TaskRepositoryProtocol
    private var cancellables = Set<AnyCancellable>()

    init(repository: TaskRepositoryProtocol) {
        self.repository = repository
    }

    func loadTasks() async {
        isLoading = true
        do {
            tasks = try await repository.fetchTasks()
        } catch {
            self.error = error
        }
        isLoading = false
    }

    func createTask(input: CreateTaskInput) async {
        do {
            let task = try await repository.createTask(input: input)
            tasks.append(task)
        } catch {
            self.error = error
        }
    }
}

// Usage in view
struct TaskListView: View {
    @StateObject private var viewModel = TaskListViewModel(repository: TaskRepository(api: TaskAPI()))

    var body: some View {
        List(viewModel.tasks) { task in
            TaskView(task: task)
        }
        .task { await viewModel.loadTasks() }
    }
}`,
        explanation: 'Both provide view logic and state management. Custom hooks use TanStack Query, while iOS uses ObservableObject with @Published properties.',
        learningNotes: [
          'Custom hooks use TanStack Query for state management',
          'ViewModels use @Published properties for reactive state',
          'Both separate view logic from UI components',
          'Both handle loading, error, and success states',
        ],
      },
      'Components': {
        name: 'Components',
        typescript: `// React component (SwiftUI View equivalent)
import type { Task } from '../../domain/models';
import { TaskStatus } from '../../domain/models';
import Badge from './Badge';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string, status: TaskStatus) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onToggleStatus }: TaskCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <Badge label={task.status} />
      <Badge label={task.priority} />
      <button onClick={() => onToggleStatus?.(task.id, TaskStatus.COMPLETED)}>
        Complete
      </button>
      <button onClick={() => onEdit?.(task)}>Edit</button>
      <button onClick={() => onDelete?.(task.id)}>Delete</button>
    </div>
  );
}`,
        swift: `// iOS SwiftUI View
import SwiftUI

struct TaskView: View {
    let task: Task
    let onEdit: (() -> Void)?
    let onDelete: (() -> Void)?
    let onToggleStatus: ((TaskStatus) -> Void)?

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(task.title)
                .font(.headline)
            if let description = task.description {
                Text(description)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }

            HStack {
                StatusBadge(status: task.status)
                PriorityBadge(priority: task.priority)
            }

            HStack(spacing: 8) {
                Button("Complete") {
                    onToggleStatus?(.completed)
                }
                Button("Edit") {
                    onEdit?()
                }
                Button("Delete") {
                    onDelete?()
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(8)
        .shadow(radius: 2)
    }
}`,
        explanation: 'Both are reusable UI components. React components are functions returning JSX, while SwiftUI Views are structs conforming to View protocol.',
        learningNotes: [
          'React components are functions with props',
          'SwiftUI Views are structs with properties',
          'Both are declarative and composable',
          'Both support props/parameters for customization',
        ],
      },
      'Screens': {
        name: 'Screens',
        typescript: `// React screen (route-level component)
import { useTaskListViewModel } from '../hooks';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

export default function TaskListScreen() {
  const { tasks, isLoading, createTask, updateTask, deleteTask, toggleTaskStatus } = useTaskListViewModel();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <h1>Tasks</h1>
      <button onClick={() => setShowForm(true)}>Create</button>
      {showForm && <TaskForm onSubmit={handleSubmit} />}
      {tasks?.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={handleEdit}
          onDelete={deleteTask}
          onToggleStatus={toggleTaskStatus}
        />
      ))}
    </div>
  );
}`,
        swift: `// iOS ViewController (route-level)
import UIKit
import SwiftUI

class TaskListViewController: UIViewController {
    private let viewModel: TaskListViewModel
    private var cancellables = Set<AnyCancellable>()

    init(viewModel: TaskListViewModel) {
        self.viewModel = viewModel
        super.init(nibName: nil, bundle: nil)
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        // Setup UI with SwiftUI view
        let contentView = TaskListView(viewModel: viewModel)
        let hostingController = UIHostingController(rootView: contentView)

        addChild(hostingController)
        view.addSubview(hostingController.view)
        hostingController.didMove(toParent: self)
    }
}

// Or use pure SwiftUI
struct TaskListView: View {
    @StateObject private var viewModel: TaskListViewModel

    var body: some View {
        NavigationView {
            List(viewModel.tasks) { task in
                TaskView(task: task)
            }
            .navigationTitle("Tasks")
            .toolbar {
                Button("Create") { viewModel.showCreateForm = true }
            }
        }
    }
}`,
        explanation: 'Both are route-level components that compose smaller components. React screens are functions, while iOS uses ViewControllers or SwiftUI views.',
        learningNotes: [
          'React screens are route-level function components',
          'iOS uses ViewControllers or SwiftUI NavigationView',
          'Both compose smaller components',
          'Both handle navigation and routing',
        ],
      },
      'Route Guards': {
        name: 'Route Guards',
        typescript: `// React route guards
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../security/presentation/context';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}`,
        swift: `// iOS Coordinator navigation logic
import UIKit

class AppCoordinator: Coordinator {
    var navigationController: UINavigationController
    private let authManager: AuthManager

    init(navigationController: UINavigationController, authManager: AuthManager) {
        self.navigationController = navigationController
        self.authManager = authManager
    }

    func navigateTo(screen: Screen) {
        switch screen {
        case .login, .register:
            // Public routes - no auth required
            if authManager.isAuthenticated {
                navigateTo(.dashboard)
                return
            }
            show(screen)
        case .dashboard, .profile, .tasks:
            // Protected routes - auth required
            guard authManager.isAuthenticated else {
                navigateTo(.login)
                return
            }
            show(screen)
        }
    }

    private func show(_ screen: Screen) {
        switch screen {
        case .login:
            let vc = LoginViewController(viewModel: LoginViewModel(coordinator: self))
            navigationController.pushViewController(vc, animated: true)
        case .dashboard:
            let vc = DashboardViewController(viewModel: DashboardViewModel(coordinator: self))
            navigationController.setViewControllers([vc], animated: true)
        // ... other screens
        }
    }
}`,
        explanation: 'Both handle route protection and conditional navigation. React uses route guards with Navigate component, while iOS uses Coordinator pattern with conditional logic.',
        learningNotes: [
          'React uses declarative route guards',
          'iOS uses imperative Coordinator pattern',
          'Both check authentication before showing content',
          'Both redirect unauthenticated users to login',
        ],
      },
    },
  },
};
