import AuthDomain
import Factory
import Observation
import SharedDomain

struct LoginViewState: Equatable {
    var email = ""
    var password = ""
    var emailError: String?
    var passwordError: String?
    var errorMessage: String?
    var isSubmitting = false
}

@Observable
final class LoginViewModel {
    enum Action: Equatable {
        case emailChanged(String)
        case passwordChanged(String)
        case submit
        case createAccountTapped
        case dismissError
    }

    private(set) var state = LoginViewState()

    @ObservationIgnored @Injected(\AuthContainer.login) private var login
    @ObservationIgnored private weak var router: (any AuthInternalRouting)?
    @ObservationIgnored private var hasSubmitted = false

    init(router: any AuthInternalRouting) {
        self.router = router
    }

    /// Handles an action synchronously; async work runs in the returned task (ios §5.2).
    @discardableResult
    func send(_ action: Action) -> Task<Void, Never>? {
        switch action {
        case .emailChanged(let email):
            state.email = email
            validateIfSubmitted()
        case .passwordChanged(let password):
            state.password = password
            validateIfSubmitted()
        case .submit:
            return submit()
        case .createAccountTapped:
            router?.showSignup()
        case .dismissError:
            state.errorMessage = nil
        }
        return nil
    }

    private func submit() -> Task<Void, Never>? {
        hasSubmitted = true
        validate()
        guard state.emailError == nil, state.passwordError == nil, !state.isSubmitting else { return nil }
        state.isSubmitting = true
        state.errorMessage = nil
        let (email, password) = (state.email, state.password)
        return Task {
            do throws(DomainError) {
                // Success needs no navigation: the session change swaps the app's root.
                _ = try await login.execute(email: email, password: password)
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
        state.emailError = FieldValidation.message { () throws(DomainError) in _ = try EmailAddress(state.email) }
        state.passwordError = FieldValidation.message { () throws(DomainError) in _ = try Password.existing(state.password) }
    }
}
