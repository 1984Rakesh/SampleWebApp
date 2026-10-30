import AuthDomain
import DesignSystem
import SwiftUI

struct SignupContainer: View {
    @State var viewModel: SignupViewModel

    var body: some View {
        SignupScreen(state: viewModel.state) { viewModel.send($0) }
    }
}

struct SignupScreen: View {
    let state: SignupViewState
    let send: (SignupViewModel.Action) -> Void

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DS.spacing.lg) {
                AuthHeader(title: "Create your account", subtitle: "Start organizing your work in minutes.")
                DSTextField(
                    "Name",
                    text: Binding(get: { state.name }, set: { send(.nameChanged($0)) }),
                    prompt: "Ada Lovelace",
                    error: state.nameError,
                    contentType: .name,
                    capitalization: .words
                )
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
                    error: state.passwordError,
                    contentType: .newPassword
                )
                .onSubmit { send(.submit) }
                Text("At least \(Password.minimumLength) characters.")
                    .font(DS.font.caption)
                    .foregroundStyle(DS.color.textMuted)
                if let errorMessage = state.errorMessage {
                    DSErrorBanner(errorMessage, onDismiss: { send(.dismissError) })
                }
                SubmitButton(title: "Create account", isSubmitting: state.isSubmitting) { send(.submit) }
                Button("Already have an account? Log in") { send(.logInTapped) }
                    .buttonStyle(.ds(.ghost))
            }
            .padding(DS.spacing.xl)
        }
        .scrollDismissesKeyboard(.interactively)
        .background(DS.color.background)
    }
}

#Preview("Empty") {
    SignupScreen(state: SignupViewState()) { _ in }
}

#Preview("Errors") {
    SignupScreen(
        state: SignupViewState(
            email: "ada@example.com",
            password: "abc",
            nameError: "Name cannot be empty",
            passwordError: "Password must be at least 6 characters",
            errorMessage: "Email already registered"
        )
    ) { _ in }
}
