import Testing
import SharedDomain
@testable import TasksDomain

enum DomainFixtures {
    static let day: Double = 86_400
    static let today = Timestamp(secondsSince1970: 20_000 * day)

    static func task(
        id: String = "t1",
        title: String = "Write notes",
        details: String? = nil,
        status: TaskStatus = .todo,
        priority: TaskPriority = .medium,
        dueDate: Timestamp? = nil
    ) -> TaskItem {
        TaskItem(
            id: TaskID(id), title: title, details: details, status: status, priority: priority,
            dueDate: dueDate, createdAt: today, updatedAt: today
        )
    }
}

@Suite struct TaskItemTests {
    @Test func overdueOnlyWhenOpenAndBeforeToday() {
        let yesterday = Timestamp(secondsSince1970: DomainFixtures.today.secondsSince1970 - DomainFixtures.day)

        #expect(DomainFixtures.task(dueDate: yesterday).isOverdue(startOfToday: DomainFixtures.today))
        #expect(!DomainFixtures.task(dueDate: DomainFixtures.today).isOverdue(startOfToday: DomainFixtures.today))
        #expect(!DomainFixtures.task(status: .completed, dueDate: yesterday).isOverdue(startOfToday: DomainFixtures.today))
        #expect(!DomainFixtures.task().isOverdue(startOfToday: DomainFixtures.today))
    }

    @Test func toggleCompletesOpenTasksAndReopensCompleted() {
        #expect(DomainFixtures.task(status: .todo).toggledStatus == .completed)
        #expect(DomainFixtures.task(status: .inProgress).toggledStatus == .completed)
        #expect(DomainFixtures.task(status: .completed).toggledStatus == .todo)
    }

    @Test func titleIsTrimmedAndRequired() throws {
        #expect(try TaskTitle("  Ship it ").value == "Ship it")
        #expect(throws: DomainError.validation("Title is required")) { try TaskTitle(" \n ") }
    }

    @Test func newTaskNormalizesDetails() throws {
        #expect(NewTask(title: try TaskTitle("a"), details: "  ", priority: .low, dueDate: nil).details == nil)
        #expect(NewTask(title: try TaskTitle("a"), details: " note ", priority: .low, dueDate: nil).details == "note")
    }
}

@Suite struct TaskUseCaseTests {
    @Test func createValidatesTitleBeforeRepository() async {
        let repository = RecordingTaskRepository()

        await #expect(throws: DomainError.validation("Title is required")) {
            try await DefaultCreateTaskUseCase(repository: repository).execute(title: " ", details: nil, priority: .high, dueDate: nil)
        }
        #expect(await repository.calls.isEmpty)
    }

    @Test func updateWithoutChangesSkipsRepository() async throws {
        let repository = RecordingTaskRepository()
        let task = DomainFixtures.task()

        let result = try await DefaultUpdateTaskUseCase(repository: repository).execute(task, changes: TaskChanges())

        #expect(result == task)
        #expect(await repository.calls.isEmpty)
    }

    @Test func updateTurnsBlankDetailsIntoClear() async throws {
        let repository = RecordingTaskRepository()

        _ = try await DefaultUpdateTaskUseCase(repository: repository).execute(DomainFixtures.task(details: "old"), changes: TaskChanges(details: .set("  ")))

        #expect(await repository.lastChanges == TaskChanges(details: .clear))
    }

    @Test func toggleSendsToggledStatus() async throws {
        let repository = RecordingTaskRepository()

        _ = try await DefaultToggleTaskStatusUseCase(repository: repository).execute(DomainFixtures.task(status: .inProgress))

        #expect(await repository.calls == ["setStatus t1 completed"])
    }

    @Test func getTaskFindsByIdOrFailsNotFound() async throws {
        let repository = RecordingTaskRepository(tasks: [DomainFixtures.task(id: "a"), DomainFixtures.task(id: "b")])
        let sut = DefaultGetTaskUseCase(repository: repository)

        #expect(try await sut.execute(id: TaskID("b")).id == TaskID("b"))
        await #expect(throws: DomainError.notFound("Task not found")) { try await sut.execute(id: TaskID("zz")) }
    }
}

actor RecordingTaskRepository: TaskRepository {
    private let stored: [TaskItem]
    private(set) var calls: [String] = []
    private(set) var lastChanges: TaskChanges?

    init(tasks: [TaskItem] = []) {
        stored = tasks
    }

    func tasks(filter: TaskFilter) async throws(DomainError) -> [TaskItem] { stored }

    func create(_ task: NewTask) async throws(DomainError) -> TaskItem {
        calls.append("create \(task.title.value)")
        return DomainFixtures.task(title: task.title.value)
    }

    func update(id: TaskID, changes: TaskChanges) async throws(DomainError) -> TaskItem {
        calls.append("update \(id.value)")
        lastChanges = changes
        return DomainFixtures.task(id: id.value)
    }

    func setStatus(id: TaskID, _ status: TaskStatus) async throws(DomainError) -> TaskItem {
        calls.append("setStatus \(id.value) \(status)")
        return DomainFixtures.task(id: id.value, status: status)
    }

    func delete(id: TaskID) async throws(DomainError) {
        calls.append("delete \(id.value)")
    }
}
