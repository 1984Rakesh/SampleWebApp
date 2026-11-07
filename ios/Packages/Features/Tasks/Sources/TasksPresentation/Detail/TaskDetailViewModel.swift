import DesignSystem
import Factory
import Foundation
import Observation
import SharedDomain
import TasksDomain

struct TaskDetailViewState: Equatable {
    struct Content: Equatable {
        let title: String
        let details: String?
        let statusLabel: String
        let statusTone: Tone
        let priorityLabel: String
        let priorityTone: Tone
        let dueText: String?
        let isOverdue: Bool
        let toggleTitle: String
        let createdText: String
        let updatedText: String
    }

    var content: Loadable<Content> = .idle
    var banner: String?
    var isWorking = false
    var isConfirmingDelete = false
}

@Observable
final class TaskDetailViewModel {
    enum Action: Equatable {
        case onAppear
        case toggleStatus
        case edit
        case deleteTapped
        case confirmDelete
        case cancelDelete
        case dismissBanner
    }

    private(set) var state = TaskDetailViewState()

    @ObservationIgnored @Injected(\TasksContainer.getTask) private var getTask
    @ObservationIgnored @Injected(\TasksContainer.toggleTaskStatus) private var toggleTaskStatus
    @ObservationIgnored @Injected(\TasksContainer.deleteTask) private var deleteTask
    @ObservationIgnored private let id: TaskID
    @ObservationIgnored private weak var router: (any TasksInternalRouting)?
    @ObservationIgnored private let presenter: () -> TaskPresenter
    @ObservationIgnored private var task: TaskItem?

    init(id: TaskID, router: any TasksInternalRouting, presenter: @escaping () -> TaskPresenter = { TaskPresenter() }) {
        self.id = id
        self.router = router
        self.presenter = presenter
    }

    /// Handles an action synchronously; async work runs in the returned task (ios §5.2).
    @discardableResult
    func send(_ action: Action) -> Task<Void, Never>? {
        switch action {
        case .onAppear:
            return load()
        case .toggleStatus:
            return toggle()
        case .edit:
            guard let task else { return nil }
            router?.showForm(.edit(task)) { [weak self] in self?.send(.onAppear) }
        case .deleteTapped:
            state.isConfirmingDelete = task != nil
        case .confirmDelete:
            state.isConfirmingDelete = false
            return delete()
        case .cancelDelete:
            state.isConfirmingDelete = false
        case .dismissBanner:
            state.banner = nil
        }
        return nil
    }

    private func load() -> Task<Void, Never> {
        if task == nil {
            state.content = .loading
        }
        return Task {
            do throws(DomainError) {
                show(try await getTask.execute(id: id))
            } catch {
                guard let message = error.message else { return }
                if task == nil {
                    state.content = .failed(message)
                } else {
                    state.banner = message
                }
            }
        }
    }

    private func toggle() -> Task<Void, Never>? {
        guard let task, !state.isWorking else { return nil }
        state.isWorking = true
        return Task {
            do throws(DomainError) {
                show(try await toggleTaskStatus.execute(task))
            } catch {
                state.banner = error.message
            }
            state.isWorking = false
        }
    }

    private func delete() -> Task<Void, Never>? {
        guard let task, !state.isWorking else { return nil }
        state.isWorking = true
        return Task {
            do throws(DomainError) {
                try await deleteTask.execute(id: task.id)
                router?.closeDetail()
            } catch {
                state.banner = error.message
            }
            state.isWorking = false
        }
    }

    private func show(_ task: TaskItem) {
        self.task = task
        let presenter = presenter()
        let overdue = presenter.isOverdue(task)
        state.content = .loaded(TaskDetailViewState.Content(
            title: task.title,
            details: task.details,
            statusLabel: TaskPresenter.label(task.status),
            statusTone: TaskPresenter.tone(task.status),
            priorityLabel: TaskPresenter.label(task.priority),
            priorityTone: TaskPresenter.tone(task.priority),
            dueText: task.dueDate.map { presenter.dueText($0, overdue: overdue) },
            isOverdue: overdue,
            toggleTitle: task.isCompleted ? "Reopen task" : "Mark as complete",
            createdText: presenter.timestampText(task.createdAt),
            updatedText: presenter.timestampText(task.updatedAt)
        ))
    }
}
