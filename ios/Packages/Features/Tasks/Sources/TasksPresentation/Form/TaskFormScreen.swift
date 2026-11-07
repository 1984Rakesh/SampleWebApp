import DesignSystem
import SwiftUI

struct TaskFormContainer: View {
    @State var viewModel: TaskFormViewModel

    var body: some View {
        TaskFormScreen(state: viewModel.state) { viewModel.send($0) }
    }
}

struct TaskFormScreen: View {
    let state: TaskFormViewState
    let send: (TaskFormViewModel.Action) -> Void

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DS.spacing.lg) {
                DSTextField(
                    "Title",
                    text: Binding(get: { state.title }, set: { send(.titleChanged($0)) }),
                    prompt: "What needs doing?",
                    error: state.titleError
                )
                DSTextArea(
                    "Description",
                    text: Binding(get: { state.details }, set: { send(.detailsChanged($0)) }),
                    prompt: "Optional"
                )
                picker("Priority", options: state.priorityOptions, selection: state.priorityID) { send(.priorityChanged($0)) }
                if let statusID = state.statusID {
                    picker("Status", options: state.statusOptions, selection: statusID) { send(.statusChanged($0)) }
                }
                VStack(alignment: .leading, spacing: DS.spacing.sm) {
                    Toggle("Due date", isOn: Binding(get: { state.hasDueDate }, set: { send(.dueDateToggled($0)) }))
                        .font(DS.font.label)
                        .tint(DS.color.primary)
                    if state.hasDueDate {
                        DatePicker(
                            "Due",
                            selection: Binding(get: { state.dueDate }, set: { send(.dueDateChanged($0)) }),
                            displayedComponents: .date
                        )
                        .datePickerStyle(.graphical)
                        .tint(DS.color.primary)
                    }
                }
                if let errorMessage = state.errorMessage {
                    DSErrorBanner(errorMessage, onDismiss: { send(.dismissError) })
                }
                Button {
                    send(.save)
                } label: {
                    ZStack {
                        Text(state.saveTitle).opacity(state.isSaving ? 0 : 1)
                        if state.isSaving { ProgressView().tint(DS.color.onPrimary) }
                    }
                }
                .buttonStyle(.ds(.primary))
                .disabled(state.isSaving)
                .accessibilityLabel(state.isSaving ? "\(state.saveTitle), in progress" : state.saveTitle)
            }
            .padding(DS.spacing.xl)
        }
        .scrollDismissesKeyboard(.interactively)
        .background(DS.color.background)
    }

    private func picker(_ title: String, options: [ChoiceOption], selection: String, onChange: @escaping (String) -> Void) -> some View {
        VStack(alignment: .leading, spacing: DS.spacing.xs) {
            Text(title)
                .font(DS.font.label)
                .foregroundStyle(DS.color.text)
            DSSegmentedFilter(
                title,
                options: options.map { .init(id: $0.id, label: $0.label) },
                selection: Binding(get: { selection }, set: { onChange($0) })
            )
        }
    }
}

#Preview("New") {
    TaskFormScreen(state: TaskFormViewState()) { _ in }
}

#Preview("Edit with error") {
    TaskFormScreen(state: TaskFormViewState(
        title: "", details: "Notes", statusID: "In progress", hasDueDate: true,
        titleError: "Title is required", errorMessage: "Task not found",
        navigationTitle: "Edit task", saveTitle: "Save changes"
    )) { _ in }
}
