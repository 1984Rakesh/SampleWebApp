import SharedDomain

/// A task as the dashboard sees it. Dashboard owns this model; App maps the Tasks feature's tasks to it (shared §2).
public struct DashboardTask: Equatable, Sendable {
    public enum Status: Sendable {
        case todo
        case inProgress
        case completed
    }

    public enum Priority: Sendable {
        case low
        case medium
        case high
    }

    public let status: Status
    public let priority: Priority
    public let dueDate: Timestamp?

    public init(status: Status, priority: Priority, dueDate: Timestamp?) {
        self.status = status
        self.priority = priority
        self.dueDate = dueDate
    }

    var isOpen: Bool {
        status != .completed
    }
}

/// Where the dashboard reads tasks from. Consumer-owned; App backs it with the Tasks feature.
public protocol DashboardTaskSource: Sendable {
    func tasks() async throws(DomainError) -> [DashboardTask]
}

/// Counts derived from the user's tasks.
public struct DashboardSummary: Equatable, Sendable {
    public static let dueSoonDays = 7

    public let total: Int
    public let todo: Int
    public let inProgress: Int
    public let completed: Int
    /// Open tasks due before today.
    public let overdue: Int
    /// Open tasks due from today through the next `dueSoonDays` days.
    public let dueSoon: Int
    public let highPriorityOpen: Int

    /// Completed share of all tasks, 0 when there are none.
    public var completionRate: Double {
        total == 0 ? 0 : Double(completed) / Double(total)
    }

    public init(tasks: [DashboardTask], startOfToday: Timestamp) {
        let dueSoonEnd = startOfToday.secondsSince1970 + Double(Self.dueSoonDays + 1) * 86_400
        total = tasks.count
        todo = tasks.count { $0.status == .todo }
        inProgress = tasks.count { $0.status == .inProgress }
        completed = tasks.count { $0.status == .completed }
        overdue = tasks.count { task in
            guard task.isOpen, let due = task.dueDate else { return false }
            return due < startOfToday
        }
        dueSoon = tasks.count { task in
            guard task.isOpen, let due = task.dueDate else { return false }
            return due >= startOfToday && due.secondsSince1970 < dueSoonEnd
        }
        highPriorityOpen = tasks.count { $0.isOpen && $0.priority == .high }
    }
}
