import SharedDomain

public protocol LoginUseCase: Sendable {
    func execute(email: String, password: String) async throws(DomainError) -> Account
}

package struct DefaultLoginUseCase: LoginUseCase {
    let repository: any SessionRepository

    package init(repository: any SessionRepository) {
        self.repository = repository
    }

    package func execute(email: String, password: String) async throws(DomainError) -> Account {
        let credentials = LoginCredentials(email: try EmailAddress(email), password: try Password.existing(password))
        return try await repository.login(credentials)
    }
}

public protocol RegisterUseCase: Sendable {
    func execute(name: String, email: String, password: String) async throws(DomainError) -> Account
}

package struct DefaultRegisterUseCase: RegisterUseCase {
    let repository: any SessionRepository

    package init(repository: any SessionRepository) {
        self.repository = repository
    }

    package func execute(name: String, email: String, password: String) async throws(DomainError) -> Account {
        let registration = Registration(
            name: try PersonName(name),
            email: try EmailAddress(email),
            password: try Password.new(password)
        )
        return try await repository.register(registration)
    }
}

public protocol RestoreSessionUseCase: Sendable {
    func execute() async -> SessionState
}

package struct DefaultRestoreSessionUseCase: RestoreSessionUseCase {
    let repository: any SessionRepository

    package init(repository: any SessionRepository) {
        self.repository = repository
    }

    package func execute() async -> SessionState {
        await repository.restore()
    }
}

public protocol ObserveSessionUseCase: Sendable {
    func execute() async -> AsyncStream<SessionState>
}

package struct DefaultObserveSessionUseCase: ObserveSessionUseCase {
    let repository: any SessionRepository

    package init(repository: any SessionRepository) {
        self.repository = repository
    }

    package func execute() async -> AsyncStream<SessionState> {
        await repository.sessionChanges()
    }
}

public protocol LogoutUseCase: Sendable {
    func execute() async
}

package struct DefaultLogoutUseCase: LogoutUseCase {
    let repository: any SessionRepository

    package init(repository: any SessionRepository) {
        self.repository = repository
    }

    package func execute() async {
        await repository.logout()
    }
}
