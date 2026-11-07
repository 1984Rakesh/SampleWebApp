import AuthDomain
import Factory

/// Auth's own DI container (ios §7.1). Test traits swap `shared` per test through `@TaskLocal`.
package nonisolated final class AuthContainer: SharedContainer {
    @TaskLocal package static var shared = AuthContainer()
    package let manager = ContainerManager()

    package init() {}
}

package nonisolated extension AuthContainer {
    /// Registered by `AuthAssembly.configure`; resolving it earlier is a wiring bug.
    var sessionRepository: Factory<any SessionRepository> {
        self { fatalError("AuthAssembly.configure must register the session repository") }
    }

    var login: Factory<any LoginUseCase> {
        self { DefaultLoginUseCase(repository: self.sessionRepository()) }
    }

    var register: Factory<any RegisterUseCase> {
        self { DefaultRegisterUseCase(repository: self.sessionRepository()) }
    }

    var restoreSession: Factory<any RestoreSessionUseCase> {
        self { DefaultRestoreSessionUseCase(repository: self.sessionRepository()) }
    }

    var observeSession: Factory<any ObserveSessionUseCase> {
        self { DefaultObserveSessionUseCase(repository: self.sessionRepository()) }
    }

    var logout: Factory<any LogoutUseCase> {
        self { DefaultLogoutUseCase(repository: self.sessionRepository()) }
    }
}
