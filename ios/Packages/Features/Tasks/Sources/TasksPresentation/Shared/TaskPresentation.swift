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
        task.isOverdue(startOfToday: DueDay.timestamp(for: now, calendar: calendar))
    }

    func dueText(_ dueDate: Timestamp, overdue: Bool) -> String {
        let today = DueDay.timestamp(for: now, calendar: calendar)
        let days = Int(((dueDate.secondsSince1970 - today.secondsSince1970) / 86_400).rounded(.down))
        let date = DueDay.format(dueDate, locale: locale)
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

/// Due dates are calendar days stored as UTC midnight (see `DueDateCoding` in Data).
/// The user picks a local day; these helpers keep the same year/month/day across the conversion.
enum DueDay {
    private static let utc: Calendar = {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = .gmt
        return calendar
    }()

    /// UTC midnight of `date`'s day in `calendar`.
    static func timestamp(for date: Date, calendar: Calendar) -> Timestamp {
        let day = calendar.dateComponents([.year, .month, .day], from: date)
        let midnight = utc.date(from: day) ?? date
        return Timestamp(secondsSince1970: midnight.timeIntervalSince1970)
    }

    /// Noon of the stored day in `calendar`, for a date picker.
    static func date(for timestamp: Timestamp, calendar: Calendar) -> Date {
        var day = utc.dateComponents([.year, .month, .day], from: Date(timeIntervalSince1970: timestamp.secondsSince1970))
        day.hour = 12
        return calendar.date(from: day) ?? Date(timeIntervalSince1970: timestamp.secondsSince1970)
    }

    static func format(_ timestamp: Timestamp, locale: Locale) -> String {
        Date(timeIntervalSince1970: timestamp.secondsSince1970)
            .formatted(Date.FormatStyle(locale: locale, timeZone: .gmt).month(.abbreviated).day())
    }
}
