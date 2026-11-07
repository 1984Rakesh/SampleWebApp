import DesignSystem
import SwiftUI

struct TaskListContainer: View {
    @State var viewModel: TaskListViewModel

    var body: some View {
        TaskListScreen(state: viewModel.state) { viewModel.send($0) }
            .refreshable { await viewModel.send(.refresh)?.value }
            .onAppear { viewModel.send(.onAppear) }
    }
}

struct TaskListScreen: View {
    let state: TaskListViewState
    let send: (TaskListViewModel.Action) -> Void

    var body: some View {
        VStack(spacing: 0) {
            DSSegmentedFilter(
                "Filter",
                options: TaskListFilter.options.map { .init(id: $0.id, label: $0.label) },
                selection: Binding(
                    get: { state.filter.rawValue },
                    set: { send(.filterChanged(TaskListFilter(rawValue: $0) ?? .all)) }
                )
            )
            .padding(.horizontal, DS.spacing.lg)
            .padding(.vertical, DS.spacing.sm)
            if let banner = state.banner {
                DSErrorBanner(banner, onDismiss: { send(.dismissBanner) })
                    .padding(.horizontal, DS.spacing.lg)
            }
            content
        }
        .background(DS.color.background)
    }

    @ViewBuilder
    private var content: some View {
        switch state.content {
        case .idle, .loading:
            DSLoadingView(message: "Loading tasks")
        case .failed(let message):
            DSEmptyState(
                systemImage: "exclamationmark.triangle",
                title: "Couldn't load tasks",
                message: message,
                actionTitle: "Try again"
            ) { send(.refresh) }
        case .loaded(let rows) where rows.isEmpty:
            ScrollView {
                DSEmptyState(systemImage: "checklist", title: "No tasks", message: state.emptyMessage)
                    .padding(.top, DS.spacing.xxl)
            }
        case .loaded(let rows):
            List {
                ForEach(rows) { row in
                    TaskRow(state: row, onToggle: { send(.toggle(id: row.id)) })
                        .contentShape(Rectangle())
                        .onTapGesture { send(.select(id: row.id)) }
                        .accessibilityAddTraits(.isButton)
                        .accessibilityHint("Opens task details")
                        .swipeActions {
                            Button("Delete", role: .destructive) { send(.delete(id: row.id)) }
                        }
                        .listRowBackground(DS.color.surface)
                }
            }
            .listStyle(.plain)
            .scrollContentBackground(.hidden)
        }
    }
}

struct TaskRow: View {
    let state: TaskRowViewState
    let onToggle: () -> Void

    var body: some View {
        HStack(alignment: .top, spacing: DS.spacing.md) {
            Button(action: onToggle) {
                Image(systemName: state.isCompleted ? "checkmark.circle.fill" : "circle")
                    .font(.title2)
                    .foregroundStyle(state.isCompleted ? DS.color.success : DS.color.checkRing)
                    .frame(width: DS.minimumHitTarget, height: DS.minimumHitTarget)
            }
            .buttonStyle(.plain)
            .accessibilityLabel(state.isCompleted ? "Mark \(state.title) as to do" : "Complete \(state.title)")

            VStack(alignment: .leading, spacing: DS.spacing.xs) {
                Text(state.title)
                    .font(DS.font.headline)
                    .foregroundStyle(state.isCompleted ? DS.color.textMuted : DS.color.text)
                    .strikethrough(state.isCompleted)
                if let subtitle = state.subtitle {
                    Text(subtitle)
                        .font(DS.font.callout)
                        .foregroundStyle(DS.color.textMuted)
                        .lineLimit(1)
                }
                DSAdaptiveStack {
                    DSBadge(state.priorityLabel, tone: state.priorityTone)
                    DSBadge(state.statusLabel, tone: state.statusTone)
                    if let dueText = state.dueText {
                        Text(dueText)
                            .font(DS.font.caption)
                            .foregroundStyle(state.isOverdue ? DS.color.danger : DS.color.textMuted)
                    }
                }
            }
            .padding(.vertical, DS.spacing.sm)
            // One VoiceOver element per task: title, details, priority, status and due date.
            .accessibilityElement(children: .combine)
        }
    }
}

#Preview("Loaded") {
    TaskListScreen(state: TaskListViewState(content: .loaded(TaskRowViewState.fixtures))) { _ in }
}

#Preview("Empty filter") {
    TaskListScreen(state: TaskListViewState(content: .loaded([]), filter: .completed)) { _ in }
}

#Preview("Failed") {
    TaskListScreen(state: TaskListViewState(content: .failed("The Internet connection appears to be offline."))) { _ in }
}

extension TaskRowViewState {
    static let fixtures = [
        TaskRowViewState(
            id: "1", title: "Write release notes", subtitle: "Summarize the iOS changes",
            statusLabel: "In progress", statusTone: .info, priorityLabel: "High", priorityTone: .danger,
            dueText: "Overdue · Oct 28", isOverdue: true, isCompleted: false
        ),
        TaskRowViewState(
            id: "2", title: "Book design review", subtitle: nil,
            statusLabel: "To do", statusTone: .neutral, priorityLabel: "Medium", priorityTone: .warning,
            dueText: "Due tomorrow", isOverdue: false, isCompleted: false
        ),
        TaskRowViewState(
            id: "3", title: "Set up CI", subtitle: nil,
            statusLabel: "Completed", statusTone: .success, priorityLabel: "Low", priorityTone: .calm,
            dueText: nil, isOverdue: false, isCompleted: true
        ),
    ]
}
