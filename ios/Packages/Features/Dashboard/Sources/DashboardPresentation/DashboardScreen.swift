import DashboardDomain
import DesignSystem
import SharedDomain
import SwiftUI

struct DashboardContainerView: View {
    @State var viewModel: DashboardViewModel

    var body: some View {
        DashboardScreen(state: viewModel.state) { viewModel.send($0) }
            .refreshable { await viewModel.send(.refresh)?.value }
            .onAppear { viewModel.send(.onAppear) }
    }
}

struct DashboardScreen: View {
    let state: DashboardViewState
    let send: (DashboardViewModel.Action) -> Void

    private let columns = [GridItem(.adaptive(minimum: 150), spacing: DS.spacing.md)]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DS.spacing.lg) {
                Text(state.greeting)
                    .font(DS.font.title)
                    .foregroundStyle(DS.color.text)
                    .accessibilityAddTraits(.isHeader)
                if let banner = state.banner {
                    DSErrorBanner(banner, onDismiss: { send(.dismissBanner) })
                }
                content
            }
            .padding(DS.spacing.lg)
        }
        .background(DS.color.background)
    }

    @ViewBuilder
    private var content: some View {
        switch state.content {
        case .idle, .loading:
            DSLoadingView(message: "Loading your summary")
                .frame(minHeight: 240)
        case .failed(let message):
            DSEmptyState(systemImage: "exclamationmark.triangle", title: "Couldn't load your summary", message: message, actionTitle: "Try again") {
                send(.refresh)
            }
        case .loaded(let content):
            DSCard {
                VStack(alignment: .leading, spacing: DS.spacing.sm) {
                    Text("Progress")
                        .font(DS.font.label)
                        .foregroundStyle(DS.color.textMuted)
                    Text(content.completionText)
                        .font(DS.font.headline)
                        .foregroundStyle(DS.color.text)
                    DSProgress(value: content.completionValue, tone: .success, accessibilityTitle: "Tasks completed")
                }
            }
            if content.isEmpty {
                DSEmptyState(systemImage: "checklist", title: "No tasks yet", message: "Add tasks in the Tasks tab to see your progress here.")
            }
            LazyVGrid(columns: columns, spacing: DS.spacing.md) {
                ForEach(content.cards) { card in
                    StatCard(state: card) { send(.cardTapped(id: card.id)) }
                }
            }
        }
    }
}

struct StatCard: View {
    let state: StatCardViewState
    let onTap: () -> Void

    var body: some View {
        if state.filter == nil {
            label
        } else {
            Button(action: onTap) { label }
                .buttonStyle(.plain)
                .accessibilityHint("Shows these tasks")
        }
    }

    private var label: some View {
        VStack(alignment: .leading, spacing: DS.spacing.xs) {
            Text(state.value)
                .font(DS.font.display)
                .foregroundStyle(state.tone == .neutral ? DS.color.text : state.tone.foregroundColor)
            Text(state.title)
                .font(DS.font.callout)
                .foregroundStyle(DS.color.textMuted)
        }
        .padding(DS.spacing.lg)
        .frame(maxWidth: .infinity, minHeight: 96, alignment: .leading)
        .background(DS.color.surface, in: RoundedRectangle(cornerRadius: DS.radius.card))
        .overlay {
            RoundedRectangle(cornerRadius: DS.radius.card).strokeBorder(DS.color.border)
        }
        .accessibilityElement(children: .combine)
    }
}

#Preview("Loaded") {
    DashboardScreen(state: DashboardViewState(
        greeting: "Hello, Ada",
        content: .loaded(DashboardViewModel.content(for: DashboardSummaryPreview.sample))
    )) { _ in }
}

#Preview("Failed") {
    DashboardScreen(state: DashboardViewState(greeting: "Hello, Ada", content: .failed("The Internet connection appears to be offline."))) { _ in }
}

private enum DashboardSummaryPreview {
    static let sample = DashboardSummary(
        tasks: [
            DashboardTask(status: .completed, priority: .low, dueDate: nil),
            DashboardTask(status: .inProgress, priority: .high, dueDate: Timestamp(secondsSince1970: 86_400)),
            DashboardTask(status: .todo, priority: .high, dueDate: Timestamp(secondsSince1970: -86_400)),
        ],
        startOfToday: Timestamp(secondsSince1970: 0)
    )
}
