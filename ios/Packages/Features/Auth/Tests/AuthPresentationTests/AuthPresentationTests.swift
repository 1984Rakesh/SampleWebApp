import Factory
import FactoryTesting
import Testing
import SharedDomain
import AuthDomain
@testable import AuthPresentation

extension Trait where Self == ContainerTrait<AuthContainer> {
    /// A fresh `AuthContainer` per test, so parallel tests never share registrations (ios §7.5).
    static var authContainer: ContainerTrait<AuthContainer> {
        .init(shared: AuthContainer.$shared, container: AuthContainer())
    }
}

final class SpyRouter: AuthInternalRouting {
    private(set) var calls: [String] = []
    func showSignup() { calls.append("signup") }
    func showLogin() { calls.append("login") }
}

struct StubLogin: LoginUseCase {
    let result: Result<Account, DomainError>
    func execute(email: String, password: String) async throws(DomainError) -> Account { try result.get() }
}

struct StubRegister: RegisterUseCase {
    let result: Result<Account, DomainError>
    func execute(name: String, email: String, password: String) async throws(DomainError) -> Account { try result.get() }
}

nonisolated private let account = Account(id: "u1", name: "Ada", email: "ada@example.com")

@Suite(.authContainer) struct LoginViewModelTests {
    @Test func fieldErrorsAppearOnlyAfterFirstSubmit() {
        AuthContainer.shared.login.register { StubLogin(result: .success(account)) }
        let sut = LoginViewModel(router: SpyRouter())

        sut.send(.emailChanged("ada"))
        #expect(sut.state.emailError == nil)

        #expect(sut.send(.submit) == nil)
        #expect(sut.state.emailError == "Invalid email format")
        #expect(sut.state.passwordError == "Password is required")

        sut.send(.emailChanged("ada@example.com"))
        #expect(sut.state.emailError == nil)
    }

    @Test func successfulSubmitClearsSubmitting() async {
        AuthContainer.shared.login.register { StubLogin(result: .success(account)) }
        let sut = LoginViewModel(router: SpyRouter())
        sut.send(.emailChanged("ada@example.com"))
        sut.send(.passwordChanged("secret"))

        let task = sut.send(.submit)
        #expect(sut.state.isSubmitting)
        await task?.value

        #expect(!sut.state.isSubmitting)
        #expect(sut.state.errorMessage == nil)
    }

    @Test func failedSubmitShowsBackendMessage() async {
        AuthContainer.shared.login.register { StubLogin(result: .failure(.unauthorized("Invalid email or password"))) }
        let sut = LoginViewModel(router: SpyRouter())
        sut.send(.emailChanged("ada@example.com"))
        sut.send(.passwordChanged("wrong"))

        await sut.send(.submit)?.value

        #expect(sut.state.errorMessage == "Invalid email or password")
        sut.send(.dismissError)
        #expect(sut.state.errorMessage == nil)
    }

    @Test func cancelledSubmitShowsNothing() async {
        AuthContainer.shared.login.register { StubLogin(result: .failure(.cancelled)) }
        let sut = LoginViewModel(router: SpyRouter())
        sut.send(.emailChanged("ada@example.com"))
        sut.send(.passwordChanged("secret"))

        await sut.send(.submit)?.value

        #expect(sut.state.errorMessage == nil)
        #expect(!sut.state.isSubmitting)
    }

    @Test func createAccountRoutesToSignup() {
        AuthContainer.shared.login.register { StubLogin(result: .success(account)) }
        let router = SpyRouter()
        let sut = LoginViewModel(router: router)

        sut.send(.createAccountTapped)

        #expect(router.calls == ["signup"])
    }
}

@Suite(.authContainer) struct SignupViewModelTests {
    @Test func validatesAllFieldsOnSubmit() {
        AuthContainer.shared.register.register { StubRegister(result: .success(account)) }
        let sut = SignupViewModel(router: SpyRouter())
        sut.send(.emailChanged("ada@example.com"))
        sut.send(.passwordChanged("abc"))

        #expect(sut.send(.submit) == nil)

        #expect(sut.state.nameError == "Name cannot be empty")
        #expect(sut.state.emailError == nil)
        #expect(sut.state.passwordError == "Password must be at least 6 characters")
    }

    @Test func conflictShowsBackendMessage() async {
        AuthContainer.shared.register.register { StubRegister(result: .failure(.conflict("Email already registered"))) }
        let sut = SignupViewModel(router: SpyRouter())
        sut.send(.nameChanged("Ada"))
        sut.send(.emailChanged("ada@example.com"))
        sut.send(.passwordChanged("secret"))

        await sut.send(.submit)?.value

        #expect(sut.state.errorMessage == "Email already registered")
    }

    @Test func logInRoutesBack() {
        AuthContainer.shared.register.register { StubRegister(result: .success(account)) }
        let router = SpyRouter()
        let sut = SignupViewModel(router: router)

        sut.send(.logInTapped)

        #expect(router.calls == ["login"])
    }
}
