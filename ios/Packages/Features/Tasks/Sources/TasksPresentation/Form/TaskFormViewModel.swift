import DesignSystem
import Factory
import Foundation
import Observation
import SharedDomain
import TasksDomain

enum TaskFormMode: Equatable {
    case create
    case edit(TaskItem)
}

struct TaskFormViewState: Equatable {
    var title = ""
    var details = ""
    var priorityID = TaskPresenter.id(.medium)
    /// Shown only when editing; new tasks always start as to-do on the server.
    var statusID: String?
    var hasDueDate = false
    var dueDate = Date.now
    var titleError: String?
    var errorMessage: String?
    var isSaving = false
    var navigationTitle = "New task"
    var saveTitle = "Create task"

    let priorityOptions = TaskPresenter.priorityOptions
    let statusOptions = TaskPresenter.statusOptions
}

@Observable
final class TaskFormViewModel {
    enum Action: Equatable {
        case titleChanged(String)
        case detailsChanged(String)
        case priorityChanged(String)
        case statusChanged(String)
        case dueDateToggled(Bool)
        case dueDateChanged(Date)
        case save
        case cancel
        case dismissError
    }

    private(set) var state = TaskFormViewState()

    @ObservationIgnored @Injected(\TasksContainer.createTask) private var createTask
    @ObservationIgnored @Injected(\TasksContainer.updateTask) private var updateTask
    @ObservationIgnored private let mode: TaskFormMode
    @ObservationIgnored private weak var router: (any TasksInternalRouting)?
    @ObservationIgnored private let onSaved: () -> Void
    @ObservationIgnored private let calendar: Calendar
    @ObservationIgnored private var hasSubmitted = false

    init(
        mode: TaskFormMode,
        router: any TasksInternalRouting,
        onSaved: @escaping () -> Void,
        calendar: Calendar = .current
    ) {
        self.mode = mode
        self.router = router
        self.onSaved = onSaved
        self.calendar = calendar
        if case .edit(let task) = mode {
            state.title = task.title
            state.details = task.details ?? ""
            state.priorityID = TaskPresenter.id(task.priority)
            state.statusID = TaskPresenter.id(task.status)
            state.hasDueDate = task.dueDate != nil
            state.dueDate = task.dueDate.map { DueDay.date(for: $0, calendar: calendar) } ?? .now
            state.navigationTitle = "Edit task"
            state.saveTitle = "Save changes"
        }
    }

    /// Handles an action synchronously; async work runs in the returned task (ios §5.2).
    @discardableResult
    func send(_ action: Action) -> Task<Void, Never>? {
        switch action {
        case .titleChanged(let title):
            state.title = title
            if hasSubmitted { validate() }
        case .detailsChanged(let details):
            state.details = details
        case .priorityChanged(let id):
            state.priorityID = id
        case .statusChanged(let id):
            state.statusID = id
        case .dueDateToggled(let isOn):
            state.hasDueDate = isOn
        case .dueDateChanged(let date):
            state.dueDate = date
        case .save:
            return save()
        case .cancel:
            router?.closeForm()
        case .dismissError:
            state.errorMessage = nil
        }
        return nil
    }

    private func save() -> Task<Void, Never>? {
        hasSubmitted = true
        validate()
        guard state.titleError == nil, !state.isSaving else { return nil }
        state.isSaving = true
        state.errorMessage = nil
        let draft = state
        return Task {
            do throws(DomainError) {
                try await persist(draft)
                onSaved()
                router?.closeForm()
            } catch {
                state.errorMessage = error.message
            }
            state.isSaving = false
        }
    }

    private func persist(_ draft: TaskFormViewState) async throws(DomainError) {
        let priority = TaskPresenter.priority(id: draft.priorityID) ?? .medium
        let dueDate = draft.hasDueDate ? DueDay.timestamp(for: draft.dueDate, calendar: calendar) : nil
        switch mode {
        case .create:
            _ = try await createTask.execute(title: draft.title, details: draft.details, priority: priority, dueDate: dueDate)
        case .edit(let original):
            _ = try await updateTask.execute(original, changes: try changes(from: draft, original: original, priority: priority, dueDate: dueDate))
        }
    }

    /// Only what the user changed, so untouched fields are never sent (shared §2).
    private func changes(
        from draft: TaskFormViewState,
        original: TaskItem,
        priority: TaskPriority,
        dueDate: Timestamp?
    ) throws(DomainError) -> TaskChanges {
        var changes = TaskChanges()
        let title = try TaskTitle(draft.title)
        if title.value != original.title { changes.title = title }
        let details = OptionalText.normalize(draft.details)
        if details != original.details { changes.details = details.map(Patch.set) ?? .clear }
        if let status = draft.statusID.flatMap(TaskPresenter.status(id:)), status != original.status { changes.status = status }
        if priority != original.priority { changes.priority = priority }
        if dueDate != original.dueDate { changes.dueDate = dueDate.map(Patch.set) ?? .clear }
        return changes
    }

    private func validate() {
        do throws(DomainError) {
            _ = try TaskTitle(state.title)
            state.titleError = nil
        } catch {
            state.titleError = error.message
        }
    }
}
