import DesignSystem
import SwiftUI

struct TaskDetailContainer: View {
    @State var viewModel: TaskDetailViewModel

    var body: some View {
        TaskDetailScreen(state: viewModel.state) { viewModel.send($0) }
            .onAppear { viewModel.send(.onAppear) }
    }
}

struct TaskDetailScreen: View {
    let state: TaskDetailViewState
    let send: (TaskDetailViewModel.Action) -> Void

    var body: some View {
        Group {
            switch state.content {
            case .idle, .loading:
                DSLoadingView(message: "Loading task")
            case .failed(let message):
                DSEmptyState(systemImage: "exclamationmark.triangle", title: "Couldn't load task", message: message, actionTitle: "Try again") {
                    send(.onAppear)
                }
            case .loaded(let content):
                loaded(content)
            }
        }
        .background(DS.color.background)
        .confirmationDialog(
            "Delete this task?",
            isPresented: Binding(get: { state.isConfirmingDelete }, set: { if !$0 { send(.cancelDelete) } }),
            titleVisibility: .visible
        ) {
            Button("Delete", role: .destructive) { send(.confirmDelete) }
            Button("Cancel", role: .cancel) { send(.cancelDelete) }
        } message: {
            Text("This can't be undone.")
        }
    }

    private func loaded(_ content: TaskDetailViewState.Content) -> some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DS.spacing.lg) {
                if let banner = state.banner {
                    DSErrorBanner(banner, onDismiss: { send(.dismissBanner) })
                }
                Text(content.title)
                    .font(DS.font.title)
                    .foregroundStyle(DS.color.text)
                    .accessibilityAddTraits(.isHeader)
                HStack(spacing: DS.spacing.sm) {
                    DSBadge(content.priorityLabel, tone: content.priorityTone)
                    DSBadge(content.statusLabel, tone: content.statusTone)
                }
                DSCard {
                    VStack(alignment: .leading, spacing: DS.spacing.md) {
                        DetailRow(label: "Due", value: content.dueText ?? "No due date", isAlert: content.isOverdue)
                        DetailRow(label: "Created", value: content.createdText)
                        DetailRow(label: "Updated", value: content.updatedText)
                    }
                }
                if let details = content.details {
                    DSCard {
                        Text(details)
                            .font(DS.font.body)
                            .foregroundStyle(DS.color.text)
                    }
                }
                Button(content.toggleTitle) { send(.toggleStatus) }
                    .buttonStyle(.ds(.primary))
                    .disabled(state.isWorking)
                Button("Edit") { send(.edit) }
                    .buttonStyle(.ds(.secondary))
                    .disabled(state.isWorking)
                Button("Delete task") { send(.deleteTapped) }
                    .buttonStyle(.ds(.ghost))
                    .foregroundStyle(DS.color.danger)
                    .disabled(state.isWorking)
            }
            .padding(DS.spacing.xl)
        }
    }
}

private struct DetailRow: View {
    let label: String
    let value: String
    var isAlert = false

    var body: some View {
        DSAdaptiveStack {
            Text(label)
                .font(DS.font.label)
                .foregroundStyle(DS.color.textMuted)
            Spacer(minLength: 0)
            Text(value)
                .font(DS.font.callout)
                .foregroundStyle(isAlert ? DS.color.danger : DS.color.text)
        }
        .accessibilityElement(children: .combine)
    }
}

#Preview("Loaded") {
    TaskDetailScreen(state: TaskDetailViewState(content: .loaded(.init(
        title: "Write release notes", details: "Summarize the iOS changes for the team.",
        statusLabel: "In progress", statusTone: .info, priorityLabel: "High", priorityTone: .danger,
        dueText: "Overdue · Oct 28", isOverdue: true, toggleTitle: "Mark as complete",
        createdText: "Oct 20, 2026 at 9:00 AM", updatedText: "Oct 29, 2026 at 4:12 PM"
    )))) { _ in }
}
