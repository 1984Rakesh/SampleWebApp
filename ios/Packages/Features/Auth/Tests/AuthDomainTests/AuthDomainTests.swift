import Testing
import SharedDomain
@testable import AuthDomain

@Suite struct CredentialTests {
    @Test func emailIsTrimmedAndLowercased() throws {
        #expect(try EmailAddress("  Ada@Example.COM ").value == "ada@example.com")
    }

    @Test(arguments: ["a@b.c", "first.last@sub.example.org", "a@.b.c", "a@b..c"])
    func acceptsServerValidEmails(raw: String) throws {
        _ = try EmailAddress(raw)
    }

    @Test(arguments: ["ada", "ada@", "@example.com", "ada@example", "ada@example.", "a b@example.com", "a@b@c.d"])
    func rejectsMalformedEmails(raw: String) {
        #expect(throws: DomainError.validation("Invalid email format")) { try EmailAddress(raw) }
    }

    @Test func blankEmailIsRequired() {
        #expect(throws: DomainError.validation("Email is required")) { try EmailAddress("   ") }
    }

    @Test func existingPasswordOnlyNeedsToBePresent() throws {
        #expect(try Password.existing("a").value == "a")
        #expect(throws: DomainError.validation("Password is required")) { try Password.existing("") }
    }

    @Test func newPasswordNeedsMinimumLength() throws {
        #expect(try Password.new("123456").value == "123456")
        #expect(throws: DomainError.validation("Password must be at least 6 characters")) { try Password.new("12345") }
    }

    @Test func nameIsTrimmedAndRequired() throws {
        #expect(try PersonName("  Ada ").value == "Ada")
        #expect(throws: DomainError.validation("Name cannot be empty")) { try PersonName(" \n") }
    }
}

@Suite struct AuthUseCaseTests {
    private let account = Account(id: "1", name: "Ada", email: "ada@example.com")

    @Test func loginNormalizesThenCallsRepository() async throws {
        let repository = RecordingSessionRepository(result: .success(account))

        let result = try await DefaultLoginUseCase(repository: repository).execute(email: " ADA@example.com", password: "pw")

        #expect(result == account)
        #expect(await repository.lastLogin == LoginCredentials(email: try EmailAddress("ada@example.com"), password: try .existing("pw")))
    }

    @Test func invalidLoginNeverReachesRepository() async {
        let repository = RecordingSessionRepository(result: .success(account))

        await #expect(throws: DomainError.validation("Invalid email format")) {
            try await DefaultLoginUseCase(repository: repository).execute(email: "ada", password: "pw")
        }
        #expect(await repository.lastLogin == nil)
    }

    @Test func registerValidatesAllFields() async throws {
        let repository = RecordingSessionRepository(result: .success(account))

        _ = try await DefaultRegisterUseCase(repository: repository).execute(name: " Ada ", email: "ada@example.com", password: "secret")

        #expect(await repository.lastRegistration?.name.value == "Ada")
        await #expect(throws: DomainError.validation("Password must be at least 6 characters")) {
            try await DefaultRegisterUseCase(repository: repository).execute(name: "Ada", email: "ada@example.com", password: "abc")
        }
    }

    @Test func repositoryErrorsPassThrough() async {
        let repository = RecordingSessionRepository(result: .failure(.unauthorized("Invalid email or password")))

        await #expect(throws: DomainError.unauthorized("Invalid email or password")) {
            try await DefaultLoginUseCase(repository: repository).execute(email: "ada@example.com", password: "pw")
        }
    }
}

private actor RecordingSessionRepository: SessionRepository {
    let result: Result<Account, DomainError>
    private(set) var lastLogin: LoginCredentials?
    private(set) var lastRegistration: Registration?

    init(result: Result<Account, DomainError>) {
        self.result = result
    }

    func restore() async -> SessionState { .signedOut }

    func login(_ credentials: LoginCredentials) async throws(DomainError) -> Account {
        lastLogin = credentials
        return try result.get()
    }

    func register(_ registration: Registration) async throws(DomainError) -> Account {
        lastRegistration = registration
        return try result.get()
    }

    func logout() async {}

    func sessionChanges() async -> AsyncStream<SessionState> {
        AsyncStream { $0.finish() }
    }
}
