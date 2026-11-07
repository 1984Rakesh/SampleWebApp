import DesignSystem
import SwiftUI

struct LoginContainer: View {
    @State var viewModel: LoginViewModel

    var body: some View {
        LoginScreen(state: viewModel.state) { viewModel.send($0) }
    }
}

struct LoginScreen: View {
    let state: LoginViewState
    let send: (LoginViewModel.Action) -> Void

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DS.spacing.lg) {
                AuthHeader(title: "Welcome back", subtitle: "Log in to manage your tasks.")
                DSTextField(
                    "Email",
                    text: Binding(get: { state.email }, set: { send(.emailChanged($0)) }),
                    prompt: "you@example.com",
                    error: state.emailError,
                    contentType: .username,
                    keyboard: .emailAddress,
                    capitalization: .never
                )
                DSSecureField(
                    "Password",
                    text: Binding(get: { state.password }, set: { send(.passwordChanged($0)) }),
                    error: state.passwordError
                )
                .onSubmit { send(.submit) }
                if let errorMessage = state.errorMessage {
                    DSErrorBanner(errorMessage, onDismiss: { send(.dismissError) })
                }
                SubmitButton(title: "Log in", isSubmitting: state.isSubmitting) { send(.submit) }
                Button("Don't have an account? Create one") { send(.createAccountTapped) }
                    .buttonStyle(.ds(.ghost))
            }
            .padding(DS.spacing.xl)
        }
        .scrollDismissesKeyboard(.interactively)
        .background(DS.color.background)
    }
}

#Preview("Empty") {
    LoginScreen(state: LoginViewState()) { _ in }
}

#Preview("Errors") {
    LoginScreen(
        state: LoginViewState(
            email: "ada",
            emailError: "Invalid email format",
            passwordError: "Password is required",
            errorMessage: "Invalid email or password"
        )
    ) { _ in }
}

#Preview("Submitting") {
    LoginScreen(state: LoginViewState(email: "ada@example.com", password: "secret", isSubmitting: true)) { _ in }
}
