import Factory
import TasksDomain

/// Tasks' own DI container (ios §7.1). Test traits swap `shared` per test through `@TaskLocal`.
package nonisolated final class TasksContainer: SharedContainer {
    @TaskLocal package static var shared = TasksContainer()
    package let manager = ContainerManager()

    /// User-scoped registrations; App resets it on sign-out through `TasksAssembly.resetSession()` (ios §7.4).
    package static let sessionScope = Scope.Cached()

    package init() {}
}

package nonisolated extension TasksContainer {
    /// Registered by `TasksAssembly.configure`; resolving it earlier is a wiring bug.
    var taskRepository: Factory<any TaskRepository> {
        self { fatalError("TasksAssembly.configure must register the task repository") }
            .scope(TasksContainer.sessionScope)
    }

    var getTasks: Factory<any GetTasksUseCase> {
        self { DefaultGetTasksUseCase(repository: self.taskRepository()) }
    }

    var getTask: Factory<any GetTaskUseCase> {
        self { DefaultGetTaskUseCase(repository: self.taskRepository()) }
    }

    var createTask: Factory<any CreateTaskUseCase> {
        self { DefaultCreateTaskUseCase(repository: self.taskRepository()) }
    }

    var updateTask: Factory<any UpdateTaskUseCase> {
        self { DefaultUpdateTaskUseCase(repository: self.taskRepository()) }
    }

    var toggleTaskStatus: Factory<any ToggleTaskStatusUseCase> {
        self { DefaultToggleTaskStatusUseCase(repository: self.taskRepository()) }
    }

    var deleteTask: Factory<any DeleteTaskUseCase> {
        self { DefaultDeleteTaskUseCase(repository: self.taskRepository()) }
    }
}
