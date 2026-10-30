import SharedDomain

public struct TaskID: Hashable, Sendable {
    public let value: String

    public init(_ value: String) {
        self.value = value
    }
}

public enum TaskStatus: CaseIterable, Sendable {
    case todo
    case inProgress
    case completed
}

public enum TaskPriority: CaseIterable, Sendable {
    case low
    case medium
    case high
}

/// A task owned by the signed-in user. Named `TaskItem` because Swift Concurrency owns `Task` (ios §1).
public struct TaskItem: Identifiable, Equatable, Sendable {
    public let id: TaskID
    public var title: String
    public var details: String?
    public var status: TaskStatus
    public var priority: TaskPriority
    public var dueDate: Timestamp?
    public let createdAt: Timestamp
    public let updatedAt: Timestamp

    public init(
        id: TaskID,
        title: String,
        details: String?,
        status: TaskStatus,
        priority: TaskPriority,
        dueDate: Timestamp?,
        createdAt: Timestamp,
        updatedAt: Timestamp
    ) {
        self.id = id
        self.title = title
        self.details = details
        self.status = status
        self.priority = priority
        self.dueDate = dueDate
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }

    public var isCompleted: Bool {
        status == .completed
    }

    /// Open tasks due before `startOfToday` are overdue; the caller decides where "today" starts.
    public func isOverdue(startOfToday: Timestamp) -> Bool {
        guard let dueDate, !isCompleted else { return false }
        return dueDate < startOfToday
    }

    /// The status a completion toggle moves to: open tasks complete, completed tasks reopen as to-do.
    public var toggledStatus: TaskStatus {
        isCompleted ? .todo : .completed
    }
}
