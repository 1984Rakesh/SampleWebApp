import Factory
import FactoryTesting
import Foundation
import Testing
import DesignSystem
import SharedDomain
import TasksDomain
@testable import TasksPresentation

extension Trait where Self == ContainerTrait<TasksContainer> {
    /// A fresh `TasksContainer` per test (ios §7.5).
    static var tasksContainer: ContainerTrait<TasksContainer> {
        .init(shared: TasksContainer.$shared, container: TasksContainer())
    }
}

// MARK: - Doubles

nonisolated enum Fixtures {
    static let day: Double = 86_400
    /// 2026-10-30 00:00 UTC.
    static let today = Timestamp(secondsSince1970: 1_793_318_400)

    static func task(
        _ id: String,
        title: String = "Task",
        details: String? = nil,
        status: TaskStatus = .todo,
        priority: TaskPriority = .medium,
        dueInDays: Double? = nil
    ) -> TaskItem {
        TaskItem(
            id: TaskID(id), title: title, details: details, status: status, priority: priority,
            dueDate: dueInDays.map { Timestamp(secondsSince1970: today.secondsSince1970 + $0 * day) },
            createdAt: today, updatedAt: today
        )
    }
}

actor FakeTaskRepository: TaskRepository {
    var stored: [TaskItem]
    var failure: DomainError?
    private(set) var lastFilter: TaskFilter?
    private(set) var lastChanges: TaskChanges?
    private(set) var created: [NewTask] = []

    init(_ tasks: [TaskItem] = [], failure: DomainError? = nil) {
        stored = tasks
        self.failure = failure
    }

    func fail(with error: DomainError?) { failure = error }

    func tasks(filter: TaskFilter) async throws(DomainError) -> [TaskItem] {
        lastFilter = filter
        if let failure { throw failure }
        return stored.filter { filter.status == nil || $0.status == filter.status }
    }

    func create(_ task: NewTask) async throws(DomainError) -> TaskItem {
        if let failure { throw failure }
        created.append(task)
        return Fixtures.task("new", title: task.title.value)
    }

    func update(id: TaskID, changes: TaskChanges) async throws(DomainError) -> TaskItem {
        if let failure { throw failure }
        lastChanges = changes
        return stored.first { $0.id == id } ?? Fixtures.task(id.value)
    }

    func setStatus(id: TaskID, _ status: TaskStatus) async throws(DomainError) -> TaskItem {
        if let failure { throw failure }
        var task = stored.first { $0.id == id } ?? Fixtures.task(id.value)
        task.status = status
        return task
    }

    func delete(id: TaskID) async throws(DomainError) {
        if let failure { throw failure }
        stored.removeAll { $0.id == id }
    }
}

final class SpyRouter: TasksInternalRouting {
    private(set) var calls: [String] = []
    private(set) var onSaved: (() -> Void)?

    func showDetail(id: TaskID) { calls.append("detail \(id.value)") }
    func showForm(_ mode: TaskFormMode, onSaved: @escaping () -> Void) {
        calls.append(mode == .create ? "form create" : "form edit")
        self.onSaved = onSaved
    }
    func closeForm() { calls.append("closeForm") }
    func closeDetail() { calls.append("closeDetail") }
}

private var utcCalendar: Calendar {
    var calendar = Calendar(identifier: .gregorian)
    calendar.timeZone = .gmt
    return calendar
}

private func presenter() -> TaskPresenter {
    TaskPresenter(now: Date(timeIntervalSince1970: Fixtures.today.secondsSince1970 + 3_600), calendar: utcCalendar, locale: Locale(identifier: "en_US"))
}

private func register(_ repository: FakeTaskRepository) {
    TasksContainer.shared.taskRepository.register { repository }
}

// MARK: - Presenter

@Suite struct TaskPresenterTests {
    @Test func rowShowsLabelsTonesAndDueText() {
        let row = presenter().row(Fixtures.task("1", title: "A", details: "First line\nSecond", status: .inProgress, priority: .high, dueInDays: -2))

        #expect(row.subtitle == "First line")
        #expect(row.statusLabel == "In progress")
        #expect(row.statusTone == .info)
        #expect(row.priorityTone == .danger)
        #expect(row.isOverdue)
        #expect(row.dueText == "Overdue · Oct 28")
    }

    @Test(arguments: [(0.0, "Due today"), (1, "Due tomorrow"), (5, "Due Nov 4")])
    func dueTextForUpcomingDays(days: Double, text: String) {
        #expect(presenter().row(Fixtures.task("1", dueInDays: days)).dueText == text)
    }

    @Test func dueDayKeepsCalendarDayAcrossTimeZones() {
        var tokyo = Calendar(identifier: .gregorian)
        tokyo.timeZone = TimeZone(identifier: "Asia/Tokyo")!
        let picked = CalendarDay.date(for: Fixtures.today, calendar: tokyo)

        #expect(CalendarDay.timestamp(for: picked, calendar: tokyo) == Fixtures.today)
    }
}

// MARK: - List

@Suite(.tasksContainer) struct TaskListViewModelTests {
    @Test func loadsRowsForFilter() async {
        let repository = FakeTaskRepository([Fixtures.task("1", status: .todo), Fixtures.task("2", status: .completed)])
        register(repository)
        let sut = TaskListViewModel(router: SpyRouter(), presenter: presenter)

        let task = sut.send(.onAppear)
        #expect(sut.state.content == .loading)
        await task?.value
        #expect(sut.state.content.value?.map(\.id) == ["1", "2"])

        await sut.send(.filterChanged(.completed))?.value
        #expect(sut.state.content.value?.map(\.id) == ["2"])
        #expect(await repository.lastFilter == TaskFilter(status: .completed))
    }

    @Test func firstLoadFailureShowsErrorStateThenRefreshFailureShowsBanner() async {
        let repository = FakeTaskRepository([Fixtures.task("1")], failure: .unavailable("Offline"))
        register(repository)
        let sut = TaskListViewModel(router: SpyRouter(), presenter: presenter)

        await sut.send(.onAppear)?.value
        #expect(sut.state.content == .failed("Offline"))

        await repository.fail(with: nil)
        await sut.send(.refresh)?.value
        await repository.fail(with: .unavailable("Offline"))
        await sut.send(.refresh)?.value

        #expect(sut.state.content.value?.count == 1)
        #expect(sut.state.banner == "Offline")
    }

    @Test func overdueFilterShowsOnlyOpenPastDueTasks() async {
        register(FakeTaskRepository([
            Fixtures.task("late", dueInDays: -1),
            Fixtures.task("done", status: .completed, dueInDays: -1),
            Fixtures.task("soon", dueInDays: 1),
            Fixtures.task("none"),
        ]))
        let sut = TaskListViewModel(router: SpyRouter(), presenter: presenter)

        await sut.send(.filterChanged(.overdue))?.value
        #expect(sut.state.content.value?.map(\.id) == ["late"])

        await sut.send(.toggle(id: "late"))?.value
        #expect(sut.state.content.value?.isEmpty == true)
        #expect(sut.state.emptyMessage == "No overdue tasks.")
    }

    @Test func toggleOutsideFilterRemovesRow() async {
        register(FakeTaskRepository([Fixtures.task("1", status: .todo), Fixtures.task("2", status: .todo)]))
        let sut = TaskListViewModel(router: SpyRouter(), presenter: presenter)
        await sut.send(.filterChanged(.todo))?.value

        await sut.send(.toggle(id: "1"))?.value

        #expect(sut.state.content.value?.map(\.id) == ["2"])
    }

    @Test func toggleInAllKeepsRowWithNewStatus() async {
        register(FakeTaskRepository([Fixtures.task("1", status: .todo)]))
        let sut = TaskListViewModel(router: SpyRouter(), presenter: presenter)
        await sut.send(.onAppear)?.value

        await sut.send(.toggle(id: "1"))?.value

        #expect(sut.state.content.value?.first?.isCompleted == true)
    }

    @Test func deleteFailureKeepsRowAndShowsBanner() async {
        let repository = FakeTaskRepository([Fixtures.task("1")])
        register(repository)
        let sut = TaskListViewModel(router: SpyRouter(), presenter: presenter)
        await sut.send(.onAppear)?.value
        await repository.fail(with: .notFound("Task not found"))

        await sut.send(.delete(id: "1"))?.value

        #expect(sut.state.content.value?.count == 1)
        #expect(sut.state.banner == "Task not found")
    }

    @Test func routesToDetailAndFormAndRefreshesAfterSave() async {
        let repository = FakeTaskRepository([Fixtures.task("1")])
        register(repository)
        let router = SpyRouter()
        let sut = TaskListViewModel(router: router, presenter: presenter)

        sut.send(.select(id: "1"))
        sut.send(.createTapped)
        #expect(router.calls == ["detail 1", "form create"])

        router.onSaved?()
        for _ in 0..<100 where sut.state.content.value == nil {
            try? await Task.sleep(for: .milliseconds(10))
        }
        #expect(sut.state.content.value?.count == 1, "content: \(sut.state.content)")
    }
}

// MARK: - Detail

@Suite(.tasksContainer) struct TaskDetailViewModelTests {
    @Test func loadsAndTogglesTask() async {
        register(FakeTaskRepository([Fixtures.task("1", title: "Ship", status: .todo)]))
        let sut = TaskDetailViewModel(id: TaskID("1"), router: SpyRouter(), presenter: presenter)

        await sut.send(.onAppear)?.value
        #expect(sut.state.content.value?.title == "Ship")
        #expect(sut.state.content.value?.toggleTitle == "Mark as complete")

        await sut.send(.toggleStatus)?.value
        #expect(sut.state.content.value?.statusLabel == "Completed")
        #expect(sut.state.content.value?.toggleTitle == "Reopen task")
    }

    @Test func missingTaskShowsFailure() async {
        register(FakeTaskRepository())
        let sut = TaskDetailViewModel(id: TaskID("gone"), router: SpyRouter(), presenter: presenter)

        await sut.send(.onAppear)?.value

        #expect(sut.state.content == .failed("Task not found"))
    }

    @Test func deleteNeedsConfirmationThenCloses() async {
        let repository = FakeTaskRepository([Fixtures.task("1")])
        register(repository)
        let router = SpyRouter()
        let sut = TaskDetailViewModel(id: TaskID("1"), router: router, presenter: presenter)
        await sut.send(.onAppear)?.value

        sut.send(.deleteTapped)
        #expect(sut.state.isConfirmingDelete)
        await sut.send(.confirmDelete)?.value

        #expect(router.calls == ["closeDetail"])
        #expect(await repository.stored.isEmpty)
    }
}

// MARK: - Form

@Suite(.tasksContainer) struct TaskFormViewModelTests {
    @Test func createValidatesOnSubmitThenLive() async {
        let repository = FakeTaskRepository()
        register(repository)
        let router = SpyRouter()
        var saved = false
        let sut = TaskFormViewModel(mode: .create, router: router, onSaved: { saved = true }, calendar: utcCalendar)

        sut.send(.titleChanged(" "))
        #expect(sut.state.titleError == nil)
        #expect(sut.send(.save) == nil)
        #expect(sut.state.titleError == "Title is required")

        sut.send(.titleChanged("Ship it"))
        #expect(sut.state.titleError == nil)
        sut.send(.priorityChanged("High"))
        sut.send(.dueDateToggled(true))
        sut.send(.dueDateChanged(CalendarDay.date(for: Fixtures.today, calendar: utcCalendar)))
        await sut.send(.save)?.value

        let created = await repository.created
        #expect(created.first?.title.value == "Ship it")
        #expect(created.first?.priority == .high)
        #expect(created.first?.dueDate == Fixtures.today)
        #expect(saved)
        #expect(router.calls == ["closeForm"])
    }

    @Test func editSendsOnlyChangedFields() async {
        let original = Fixtures.task("1", title: "Ship", details: "Notes", status: .todo, priority: .low, dueInDays: 2)
        let repository = FakeTaskRepository([original])
        register(repository)
        let sut = TaskFormViewModel(mode: .edit(original), router: SpyRouter(), onSaved: {}, calendar: utcCalendar)
        #expect(sut.state.statusID == "To do")

        sut.send(.detailsChanged("  "))
        sut.send(.statusChanged("In progress"))
        sut.send(.dueDateToggled(false))
        await sut.send(.save)?.value

        #expect(await repository.lastChanges == TaskChanges(details: .clear, status: .inProgress, dueDate: .clear))
    }

    @Test func failedSaveShowsMessageAndStaysOpen() async {
        register(FakeTaskRepository(failure: .unavailable("Offline")))
        let router = SpyRouter()
        let sut = TaskFormViewModel(mode: .create, router: router, onSaved: {}, calendar: utcCalendar)
        sut.send(.titleChanged("Ship"))

        await sut.send(.save)?.value

        #expect(sut.state.errorMessage == "Offline")
        #expect(!sut.state.isSaving)
        #expect(router.calls.isEmpty)
    }
}
