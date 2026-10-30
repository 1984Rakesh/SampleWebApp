import SharedDomain

public protocol GetTasksUseCase: Sendable {
    func execute(_ filter: TaskFilter) async throws(DomainError) -> [TaskItem]
}

package struct DefaultGetTasksUseCase: GetTasksUseCase {
    let repository: any TaskRepository

    package init(repository: any TaskRepository) {
        self.repository = repository
    }

    package func execute(_ filter: TaskFilter) async throws(DomainError) -> [TaskItem] {
        try await repository.tasks(filter: filter)
    }
}

/// One task by id. The API has no single-task read, so this reads the list and picks the task.
public protocol GetTaskUseCase: Sendable {
    func execute(id: TaskID) async throws(DomainError) -> TaskItem
}

package struct DefaultGetTaskUseCase: GetTaskUseCase {
    let repository: any TaskRepository

    package init(repository: any TaskRepository) {
        self.repository = repository
    }

    package func execute(id: TaskID) async throws(DomainError) -> TaskItem {
        guard let task = try await repository.tasks(filter: .all).first(where: { $0.id == id }) else {
            throw .notFound("Task not found")
        }
        return task
    }
}

public protocol CreateTaskUseCase: Sendable {
    func execute(title: String, details: String?, priority: TaskPriority, dueDate: Timestamp?) async throws(DomainError) -> TaskItem
}

package struct DefaultCreateTaskUseCase: CreateTaskUseCase {
    let repository: any TaskRepository

    package init(repository: any TaskRepository) {
        self.repository = repository
    }

    package func execute(
        title: String,
        details: String?,
        priority: TaskPriority,
        dueDate: Timestamp?
    ) async throws(DomainError) -> TaskItem {
        let task = NewTask(title: try TaskTitle(title), details: details, priority: priority, dueDate: dueDate)
        return try await repository.create(task)
    }
}

public protocol UpdateTaskUseCase: Sendable {
    /// Applies `changes`; with nothing to change it returns `original` without a request.
    func execute(_ original: TaskItem, changes: TaskChanges) async throws(DomainError) -> TaskItem
}

package struct DefaultUpdateTaskUseCase: UpdateTaskUseCase {
    let repository: any TaskRepository

    package init(repository: any TaskRepository) {
        self.repository = repository
    }

    package func execute(_ original: TaskItem, changes: TaskChanges) async throws(DomainError) -> TaskItem {
        var normalized = changes
        if case .set(let details) = changes.details {
            normalized.details = OptionalText.normalize(details).map(Patch.set) ?? .clear
        }
        guard !normalized.isEmpty else { return original }
        return try await repository.update(id: original.id, changes: normalized)
    }
}

public protocol ToggleTaskStatusUseCase: Sendable {
    func execute(_ task: TaskItem) async throws(DomainError) -> TaskItem
}

package struct DefaultToggleTaskStatusUseCase: ToggleTaskStatusUseCase {
    let repository: any TaskRepository

    package init(repository: any TaskRepository) {
        self.repository = repository
    }

    package func execute(_ task: TaskItem) async throws(DomainError) -> TaskItem {
        try await repository.setStatus(id: task.id, task.toggledStatus)
    }
}

public protocol DeleteTaskUseCase: Sendable {
    func execute(id: TaskID) async throws(DomainError)
}

package struct DefaultDeleteTaskUseCase: DeleteTaskUseCase {
    let repository: any TaskRepository

    package init(repository: any TaskRepository) {
        self.repository = repository
    }

    package func execute(id: TaskID) async throws(DomainError) {
        try await repository.delete(id: id)
    }
}
