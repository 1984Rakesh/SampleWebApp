import SharedDomain

/// The signed-in user's tasks. Identity comes from the session, never from a parameter (shared §5).
public protocol TaskRepository: Sendable {
    /// Newest first.
    func tasks(filter: TaskFilter) async throws(DomainError) -> [TaskItem]
    func create(_ task: NewTask) async throws(DomainError) -> TaskItem
    func update(id: TaskID, changes: TaskChanges) async throws(DomainError) -> TaskItem
    func setStatus(id: TaskID, _ status: TaskStatus) async throws(DomainError) -> TaskItem
    func delete(id: TaskID) async throws(DomainError)
}
