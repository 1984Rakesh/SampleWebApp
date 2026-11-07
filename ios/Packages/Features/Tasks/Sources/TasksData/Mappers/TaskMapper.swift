import Foundation
import Networking
import SharedDomain
import TasksDomain

/// Normalizes then validates server tasks, and maps domain commands to request DTOs (shared §2).
enum TaskMapper {
    static let unexpectedResponse = DomainError.unavailable("Unexpected server response")

    static func task(from dto: TaskResponseDTO) throws(DomainError) -> TaskItem {
        guard let id = nonEmpty(dto.id),
              let title = nonEmpty(dto.title),
              let status = dto.status.flatMap(status(from:)),
              let priority = dto.priority.flatMap(priority(from:)),
              let createdAt = dto.createdAt.flatMap(timestamp(from:)),
              let updatedAt = dto.updatedAt.flatMap(timestamp(from:))
        else { throw unexpectedResponse }
        let dueDate: Timestamp?
        if let rawDueDate = nonEmpty(dto.dueDate) {
            guard let parsed = DueDateCoding.parse(rawDueDate) else { throw unexpectedResponse }
            dueDate = parsed
        } else {
            dueDate = nil
        }
        return TaskItem(
            id: TaskID(id),
            title: title,
            details: nonEmpty(dto.description),
            status: status,
            priority: priority,
            dueDate: dueDate,
            createdAt: createdAt,
            updatedAt: updatedAt
        )
    }

    static func createRequest(from task: NewTask) -> CreateTaskRequestDTO {
        CreateTaskRequestDTO(
            title: task.title.value,
            description: task.details,
            priority: raw(task.priority),
            dueDate: task.dueDate.map(DueDateCoding.format)
        )
    }

    static func updateRequest(from changes: TaskChanges) -> UpdateTaskRequestDTO {
        UpdateTaskRequestDTO(
            title: changes.title?.value,
            description: patchField(changes.details) { $0 },
            status: changes.status.map(raw),
            priority: changes.priority.map(raw),
            dueDate: patchField(changes.dueDate, DueDateCoding.format)
        )
    }

    static func raw(_ status: TaskStatus) -> String {
        switch status {
        case .todo: "TODO"
        case .inProgress: "IN_PROGRESS"
        case .completed: "COMPLETED"
        }
    }

    static func raw(_ priority: TaskPriority) -> String {
        switch priority {
        case .low: "LOW"
        case .medium: "MEDIUM"
        case .high: "HIGH"
        }
    }

    private static func status(from raw: String) -> TaskStatus? {
        TaskStatus.allCases.first { self.raw($0) == raw.trimmedWhitespace.uppercased() }
    }

    private static func priority(from raw: String) -> TaskPriority? {
        TaskPriority.allCases.first { self.raw($0) == raw.trimmedWhitespace.uppercased() }
    }

    private static func timestamp(from raw: String) -> Timestamp? {
        JSONCoding.parseDate(raw.trimmedWhitespace).map { Timestamp(secondsSince1970: $0.timeIntervalSince1970) }
    }

    private static func patchField<Value>(_ patch: Patch<Value>, _ transform: (Value) -> String) -> PatchField<String> {
        switch patch {
        case .keep: .omit
        case .clear: .null
        case .set(let value): .value(transform(value))
        }
    }

    private static func nonEmpty(_ text: String?) -> String? {
        guard let trimmed = text?.trimmedWhitespace, !trimmed.isEmpty else { return nil }
        return trimmed
    }
}

/// Due dates are calendar days. The web client sends `YYYY-MM-DD` (read as UTC midnight, like JavaScript);
/// older data may hold full ISO timestamps. iOS writes `YYYY-MM-DD`.
enum DueDateCoding {
    private static let dayStyle = Date.ISO8601FormatStyle(timeZone: .gmt).year().month().day()

    static func parse(_ raw: String) -> Timestamp? {
        let date = (try? dayStyle.parse(raw)) ?? JSONCoding.parseDate(raw)
        return date.map { Timestamp(secondsSince1970: $0.timeIntervalSince1970) }
    }

    static func format(_ timestamp: Timestamp) -> String {
        dayStyle.format(Date(timeIntervalSince1970: timestamp.secondsSince1970))
    }
}
