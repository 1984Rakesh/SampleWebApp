import DesignSystem
import Foundation
import SharedDomain
import TasksDomain

/// One row of the task list. Display values only (ios §5.1).
struct TaskRowViewState: Identifiable, Equatable {
    let id: String
    let title: String
    let subtitle: String?
    let statusLabel: String
    let statusTone: Tone
    let priorityLabel: String
    let priorityTone: Tone
    let dueText: String?
    let isOverdue: Bool
    let isCompleted: Bool
}

/// Labels, tones and due-date text for tasks. `now`, `calendar` and `locale` are injectable for tests.
struct TaskPresenter {
    var now: Date = .now
    var calendar: Calendar = .current
    var locale: Locale = .current

    func row(_ task: TaskItem) -> TaskRowViewState {
        TaskRowViewState(
            id: task.id.value,
            title: task.title,
            subtitle: task.details.map { $0.split(separator: "\n", maxSplits: 1).first.map(String.init) ?? $0 },
            statusLabel: Self.label(task.status),
            statusTone: Self.tone(task.status),
            priorityLabel: Self.label(task.priority),
            priorityTone: Self.tone(task.priority),
            dueText: task.dueDate.map { dueText($0, overdue: isOverdue(task)) },
            isOverdue: isOverdue(task),
            isCompleted: task.isCompleted
        )
    }

    func isOverdue(_ task: TaskItem) -> Bool {
        task.isOverdue(startOfToday: CalendarDay.timestamp(for: now, calendar: calendar))
    }

    func dueText(_ dueDate: Timestamp, overdue: Bool) -> String {
        let today = CalendarDay.timestamp(for: now, calendar: calendar)
        let days = Int(((dueDate.secondsSince1970 - today.secondsSince1970) / 86_400).rounded(.down))
        let date = CalendarDay.format(dueDate, locale: locale)
        if overdue { return "Overdue · \(date)" }
        switch days {
        case 0: return "Due today"
        case 1: return "Due tomorrow"
        default: return "Due \(date)"
        }
    }

    func timestampText(_ timestamp: Timestamp) -> String {
        Date(timeIntervalSince1970: timestamp.secondsSince1970)
            .formatted(Date.FormatStyle(date: .abbreviated, time: .shortened, locale: locale, calendar: calendar, timeZone: calendar.timeZone))
    }

    static func label(_ status: TaskStatus) -> String {
        switch status {
        case .todo: "To do"
        case .inProgress: "In progress"
        case .completed: "Completed"
        }
    }

    static func tone(_ status: TaskStatus) -> Tone {
        switch status {
        case .todo: .neutral
        case .inProgress: .info
        case .completed: .success
        }
    }

    static func label(_ priority: TaskPriority) -> String {
        switch priority {
        case .low: "Low"
        case .medium: "Medium"
        case .high: "High"
        }
    }

    static func tone(_ priority: TaskPriority) -> Tone {
        switch priority {
        case .low: .calm
        case .medium: .warning
        case .high: .danger
        }
    }

    static let priorityOptions = TaskPriority.allCases.map { ChoiceOption(id: id($0), label: label($0)) }
    static let statusOptions = TaskStatus.allCases.map { ChoiceOption(id: id($0), label: label($0)) }

    static func id(_ priority: TaskPriority) -> String { label(priority) }
    static func id(_ status: TaskStatus) -> String { label(status) }

    static func priority(id: String) -> TaskPriority? { TaskPriority.allCases.first { self.id($0) == id } }
    static func status(id: String) -> TaskStatus? { TaskStatus.allCases.first { self.id($0) == id } }
}
