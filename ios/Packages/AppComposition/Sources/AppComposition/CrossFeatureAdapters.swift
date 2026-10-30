import DashboardFeature
import SharedDomain
import TasksFeature

/// Backs Dashboard's `DashboardTaskSource` with the Tasks feature. Only App knows both (shared §1, §2).
struct TasksDashboardSource: DashboardTaskSource {
    /// Resolved per request, so a sign-out's session reset is honored.
    let getTasks: @Sendable () -> any GetTasksUseCase

    func tasks() async throws(DomainError) -> [DashboardTask] {
        try await getTasks().execute(.all).map(Self.dashboardTask)
    }

    static func dashboardTask(_ task: TaskItem) -> DashboardTask {
        let status: DashboardTask.Status = switch task.status {
        case .todo: .todo
        case .inProgress: .inProgress
        case .completed: .completed
        }
        let priority: DashboardTask.Priority = switch task.priority {
        case .low: .low
        case .medium: .medium
        case .high: .high
        }
        return DashboardTask(status: status, priority: priority, dueDate: task.dueDate)
    }
}

/// Maps a Dashboard card's filter to the Tasks route that shows it.
enum TasksRouteBridge {
    static func route(for filter: DashboardTaskFilter) -> TasksRoute {
        switch filter {
        case .all: .list(status: nil)
        case .todo: .list(status: .todo)
        case .inProgress: .list(status: .inProgress)
        case .completed: .list(status: .completed)
        case .overdue: .overdue
        }
    }
}
