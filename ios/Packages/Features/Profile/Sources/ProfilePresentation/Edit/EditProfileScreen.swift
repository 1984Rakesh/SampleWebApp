import DesignSystem
import SwiftUI

struct EditProfileContainerView: View {
    @State var viewModel: EditProfileViewModel

    var body: some View {
        EditProfileScreen(state: viewModel.state) { viewModel.send($0) }
    }
}

struct EditProfileScreen: View {
    let state: EditProfileViewState
    let send: (EditProfileViewModel.Action) -> Void

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DS.spacing.lg) {
                DSTextField(
                    "Name",
                    text: Binding(get: { state.name }, set: { send(.nameChanged($0)) }),
                    error: state.nameError,
                    contentType: .name,
                    capitalization: .words
                )
                DSTextArea(
                    "Bio",
                    text: Binding(get: { state.bio }, set: { send(.bioChanged($0)) }),
                    prompt: "A sentence about you"
                )
                if let errorMessage = state.errorMessage {
                    DSErrorBanner(errorMessage, onDismiss: { send(.dismissError) })
                }
                Button {
                    send(.save)
                } label: {
                    ZStack {
                        Text("Save").opacity(state.isSaving ? 0 : 1)
                        if state.isSaving { ProgressView().tint(DS.color.onPrimary) }
                    }
                }
                .buttonStyle(.ds(.primary))
                .disabled(state.isSaving)
                .accessibilityLabel(state.isSaving ? "Save, in progress" : "Save")
            }
            .padding(DS.spacing.xl)
        }
        .scrollDismissesKeyboard(.interactively)
        .background(DS.color.background)
    }
}

#Preview {
    EditProfileScreen(state: EditProfileViewState(name: "", bio: "Writes programs", nameError: "Name cannot be empty")) { _ in }
}
