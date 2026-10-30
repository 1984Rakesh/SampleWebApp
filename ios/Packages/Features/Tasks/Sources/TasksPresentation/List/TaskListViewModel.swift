import DesignSystem
import Factory
import Foundation
import Observation
import SharedDomain
import TasksDomain

/// The list's status filter, as the screen offers it.
enum TaskListFilter: String, CaseIterable, Equatable {
    case all
    case todo
    case inProgress
    case completed

    init(status: TaskStatus?) {
        switch status {
        case nil: self = .all
        case .todo: self = .todo
        case .inProgress: self = .inProgress
        case .completed: self = .completed
        }
    }

    var status: TaskStatus? {
        switch self {
        case .all: nil
        case .todo: .todo
        case .inProgress: .inProgress
        case .completed: .completed
        }
    }

    var label: String {
        status.map(TaskPresenter.label) ?? "All"
    }

    static let options = allCases.map { ChoiceOption(id: $0.rawValue, label: $0.label) }
}

struct TaskListViewState: Equatable {
    var content: Loadable<[TaskRowViewState]> = .idle
    var filter: TaskListFilter = .all
    /// A non-blocking error after a refresh, toggle or delete while rows are shown.
    var banner: String?

    var emptyMessage: String {
        filter == .all ? "Tap + to add your first task." : "No \(filter.label.lowercased()) tasks."
    }
}

@Observable
final class TaskListViewModel {
    enum Action: Equatable {
        case onAppear
        case refresh
        case filterChanged(TaskListFilter)
        case toggle(id: String)
        case delete(id: String)
        case select(id: String)
        case createTapped
        case dismissBanner
    }

    private(set) var state = TaskListViewState()

    @ObservationIgnored @Injected(\TasksContainer.getTasks) private var getTasks
    @ObservationIgnored @Injected(\TasksContainer.toggleTaskStatus) private var toggleTaskStatus
    @ObservationIgnored @Injected(\TasksContainer.deleteTask) private var deleteTask
    @ObservationIgnored private weak var router: (any TasksInternalRouting)?
    @ObservationIgnored private let presenter: () -> TaskPresenter
    @ObservationIgnored private var tasks: [TaskItem] = []
    @ObservationIgnored private var loadTask: Task<Void, Never>?

    init(router: any TasksInternalRouting, presenter: @escaping () -> TaskPresenter = { TaskPresenter() }) {
        self.router = router
        self.presenter = presenter
    }

    /// Handles an action synchronously; async work runs in the returned task (ios §5.2).
    @discardableResult
    func send(_ action: Action) -> Task<Void, Never>? {
        switch action {
        case .onAppear, .refresh:
            return load()
        case .filterChanged(let filter):
            guard filter != state.filter || state.content == .idle else { return nil }
            state.filter = filter
            state.content = .idle
            return load()
        case .toggle(let id):
            return toggle(id: id)
        case .delete(let id):
            return delete(id: id)
        case .select(let id):
            router?.showDetail(id: TaskID(id))
        case .createTapped:
            router?.showForm(.create) { [weak self] in self?.send(.refresh) }
        case .dismissBanner:
            state.banner = nil
        }
        return nil
    }

    /// Starts a load, cancelling any older one so a stale response never wins.
    private func load() -> Task<Void, Never> {
        loadTask?.cancel()
        if state.content.value == nil {
            state.content = .loading
        }
        let filter = TaskFilter(status: state.filter.status)
        let task = Task {
            do throws(DomainError) {
                let loaded = try await getTasks.execute(filter)
                guard !Task.isCancelled else { return }
                tasks = loaded
                render()
            } catch {
                guard !Task.isCancelled, let message = error.message else { return }
                if state.content.value == nil {
                    state.content = .failed(message)
                } else {
                    state.banner = message
                }
            }
        }
        loadTask = task
        return task
    }

    private func toggle(id: String) -> Task<Void, Never>? {
        guard let task = tasks.first(where: { $0.id.value == id }) else { return nil }
        return Task {
            do throws(DomainError) {
                let updated = try await toggleTaskStatus.execute(task)
                replace(updated)
            } catch {
                state.banner = error.message
            }
        }
    }

    private func delete(id: String) -> Task<Void, Never>? {
        guard let task = tasks.first(where: { $0.id.value == id }) else { return nil }
        return Task {
            do throws(DomainError) {
                try await deleteTask.execute(id: task.id)
                tasks.removeAll { $0.id == task.id }
                render()
            } catch {
                state.banner = error.message
            }
        }
    }

    /// Keeps an updated task only if it still matches the active filter.
    private func replace(_ updated: TaskItem) {
        if let status = state.filter.status, updated.status != status {
            tasks.removeAll { $0.id == updated.id }
        } else if let index = tasks.firstIndex(where: { $0.id == updated.id }) {
            tasks[index] = updated
        }
        render()
    }

    private func render() {
        let presenter = presenter()
        state.content = .loaded(tasks.map(presenter.row))
    }
}
