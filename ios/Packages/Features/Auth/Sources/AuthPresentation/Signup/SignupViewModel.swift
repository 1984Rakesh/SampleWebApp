import AuthDomain
import Factory
import Observation
import SharedDomain

struct SignupViewState: Equatable {
    var name = ""
    var email = ""
    var password = ""
    var nameError: String?
    var emailError: String?
    var passwordError: String?
    var errorMessage: String?
    var isSubmitting = false
}

@Observable
final class SignupViewModel {
    enum Action: Equatable {
        case nameChanged(String)
        case emailChanged(String)
        case passwordChanged(String)
        case submit
        case logInTapped
        case dismissError
    }

    private(set) var state = SignupViewState()

    @ObservationIgnored @Injected(\AuthContainer.register) private var register
    @ObservationIgnored private weak var router: (any AuthInternalRouting)?
    @ObservationIgnored private var hasSubmitted = false

    init(router: any AuthInternalRouting) {
        self.router = router
    }

    /// Handles an action synchronously; async work runs in the returned task (ios §5.2).
    @discardableResult
    func send(_ action: Action) -> Task<Void, Never>? {
        switch action {
        case .nameChanged(let name):
            state.name = name
            validateIfSubmitted()
        case .emailChanged(let email):
            state.email = email
            validateIfSubmitted()
        case .passwordChanged(let password):
            state.password = password
            validateIfSubmitted()
        case .submit:
            return submit()
        case .logInTapped:
            router?.showLogin()
        case .dismissError:
            state.errorMessage = nil
        }
        return nil
    }

    private func submit() -> Task<Void, Never>? {
        hasSubmitted = true
        validate()
        let hasFieldErrors = state.nameError != nil || state.emailError != nil || state.passwordError != nil
        guard !hasFieldErrors, !state.isSubmitting else { return nil }
        state.isSubmitting = true
        state.errorMessage = nil
        let (name, email, password) = (state.name, state.email, state.password)
        return Task {
            do throws(DomainError) {
                // Success needs no navigation: the session change swaps the app's root.
                _ = try await register.execute(name: name, email: email, password: password)
            } catch {
                state.errorMessage = error.message
            }
            state.isSubmitting = false
        }
    }

    private func validateIfSubmitted() {
        if hasSubmitted { validate() }
    }

    private func validate() {
        state.nameError = FieldValidation.message { () throws(DomainError) in _ = try PersonName(state.name) }
        state.emailError = FieldValidation.message { () throws(DomainError) in _ = try EmailAddress(state.email) }
        state.passwordError = FieldValidation.message { () throws(DomainError) in _ = try Password.new(state.password) }
    }
}
