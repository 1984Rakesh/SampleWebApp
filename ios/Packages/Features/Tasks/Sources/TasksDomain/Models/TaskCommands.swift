import SharedDomain

/// A trimmed, non-empty task title (mirrors the server's `normalizeTaskTitle`).
public struct TaskTitle: Equatable, Sendable {
    public let value: String

    public init(_ raw: String) throws(DomainError) {
        let normalized = raw.trimmedWhitespace
        guard !normalized.isEmpty else { throw .validation("Title is required") }
        value = normalized
    }
}

/// Optional free text: trimmed, and empty means absent (mirrors the server's `normalizeOptionalText`).
public enum OptionalText {
    public static func normalize(_ raw: String?) -> String? {
        guard let trimmed = raw?.trimmedWhitespace, !trimmed.isEmpty else { return nil }
        return trimmed
    }
}

public struct NewTask: Equatable, Sendable {
    public let title: TaskTitle
    public let details: String?
    public let priority: TaskPriority
    public let dueDate: Timestamp?

    public init(title: TaskTitle, details: String?, priority: TaskPriority, dueDate: Timestamp?) {
        self.title = title
        self.details = OptionalText.normalize(details)
        self.priority = priority
        self.dueDate = dueDate
    }
}

/// Changes to an existing task. `nil` keeps a required field; `Patch` covers the nullable ones (shared §2).
public struct TaskChanges: Equatable, Sendable {
    public var title: TaskTitle?
    public var details: Patch<String>
    public var status: TaskStatus?
    public var priority: TaskPriority?
    public var dueDate: Patch<Timestamp>

    public init(
        title: TaskTitle? = nil,
        details: Patch<String> = .keep,
        status: TaskStatus? = nil,
        priority: TaskPriority? = nil,
        dueDate: Patch<Timestamp> = .keep
    ) {
        self.title = title
        self.details = details
        self.status = status
        self.priority = priority
        self.dueDate = dueDate
    }

    public var isEmpty: Bool {
        self == TaskChanges()
    }
}

/// Server-side list filter; `nil` means any.
public struct TaskFilter: Equatable, Sendable {
    public var status: TaskStatus?
    public var priority: TaskPriority?

    public init(status: TaskStatus? = nil, priority: TaskPriority? = nil) {
        self.status = status
        self.priority = priority
    }

    public static let all = TaskFilter()
}
