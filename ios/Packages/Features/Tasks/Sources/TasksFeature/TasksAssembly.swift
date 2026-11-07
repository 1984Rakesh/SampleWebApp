@_exported import TasksDomain
@_exported import TasksPresentation
import Factory
import Networking
import TasksData

/// Tasks' only public entry point (shared §10). App passes in the authenticated transport.
public enum TasksAssembly {
    /// Registers Tasks' implementations. Call once at launch, after Auth is configured.
    ///
    /// `client` must add the signed-in user's credentials; Tasks never sees tokens (ios §4.4).
    public static func configure(client: any HTTPClient) {
        TasksContainer.shared.taskRepository.register { APITaskRepository(client: client) }
    }

    /// A fresh Tasks stack for a signed-in user.
    public static func makeFlow() -> any TasksFlow {
        TasksCoordinator()
    }

    /// Reads the signed-in user's tasks; App adapts it for features that summarize tasks.
    nonisolated public static func getTasks() -> any GetTasksUseCase {
        TasksContainer.shared.getTasks()
    }

    /// Drops user-scoped registrations on sign-out (ios §7.4).
    public static func resetSession() {
        TasksContainer.shared.manager.reset(scope: TasksContainer.sessionScope)
    }
}
