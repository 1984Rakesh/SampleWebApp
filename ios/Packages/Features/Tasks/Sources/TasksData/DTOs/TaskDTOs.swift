import Foundation

/// `TaskResponse` from the server. Every field is optional so the mapper can validate instead of crash.
struct TaskResponseDTO: Decodable {
    let id: String?
    let title: String?
    let description: String?
    let status: String?
    let priority: String?
    let dueDate: String?
    let createdAt: String?
    let updatedAt: String?
}

struct CreateTaskRequestDTO: Encodable {
    let title: String
    let description: String?
    let priority: String
    let dueDate: String?
}

/// A tri-state field in a request body: omitted keeps, `null` clears, a value sets (shared §2).
enum PatchField<Value: Encodable>: Equatable where Value: Equatable {
    case omit
    case null
    case value(Value)
}

struct UpdateTaskRequestDTO: Encodable, Equatable {
    var title: String?
    var description: PatchField<String> = .omit
    var status: String?
    var priority: String?
    var dueDate: PatchField<String> = .omit

    private enum CodingKeys: String, CodingKey {
        case title, description, status, priority, dueDate
    }

    func encode(to encoder: any Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encodeIfPresent(title, forKey: .title)
        try encode(description, forKey: .description, in: &container)
        try container.encodeIfPresent(status, forKey: .status)
        try container.encodeIfPresent(priority, forKey: .priority)
        try encode(dueDate, forKey: .dueDate, in: &container)
    }

    private func encode(
        _ field: PatchField<String>,
        forKey key: CodingKeys,
        in container: inout KeyedEncodingContainer<CodingKeys>
    ) throws {
        switch field {
        case .omit: break
        case .null: try container.encodeNil(forKey: key)
        case .value(let value): try container.encode(value, forKey: key)
        }
    }
}

struct UpdateTaskStatusRequestDTO: Encodable {
    let status: String
}
