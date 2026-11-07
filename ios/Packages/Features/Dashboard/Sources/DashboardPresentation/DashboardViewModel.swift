import DashboardDomain
import DesignSystem
import Factory
import Foundation
import Observation
import SharedDomain

struct StatCardViewState: Identifiable, Equatable {
    let id: String
    let title: String
    let value: String
    let tone: Tone
    /// Where tapping the card leads; `nil` when it only informs.
    let filter: DashboardTaskFilter?
}

struct DashboardViewState: Equatable {
    struct Content: Equatable {
        let cards: [StatCardViewState]
        let completionValue: Double
        let completionText: String
        let isEmpty: Bool
    }

    var greeting = ""
    var content: Loadable<Content> = .idle
    var banner: String?
}

@Observable
final class DashboardViewModel {
    enum Action: Equatable {
        case onAppear
        case refresh
        case cardTapped(id: String)
        case dismissBanner
    }

    private(set) var state = DashboardViewState()

    @ObservationIgnored @Injected(\DashboardContainer.getSummary) private var getSummary
    @ObservationIgnored private weak var router: (any DashboardExternalRouting)?
    @ObservationIgnored private let now: () -> Date
    @ObservationIgnored private let calendar: Calendar
    @ObservationIgnored private var loadTask: Task<Void, Never>?

    init(
        displayName: String,
        router: any DashboardExternalRouting,
        now: @escaping () -> Date = Date.init,
        calendar: Calendar = .current
    ) {
        self.router = router
        self.now = now
        self.calendar = calendar
        state.greeting = displayName.isEmpty ? "Welcome back" : "Hello, \(displayName)"
    }

    /// Handles an action synchronously; async work runs in the returned task (ios §5.2).
    @discardableResult
    func send(_ action: Action) -> Task<Void, Never>? {
        switch action {
        case .onAppear, .refresh:
            return load()
        case .cardTapped(let id):
            if let filter = state.content.value?.cards.first(where: { $0.id == id })?.filter {
                router?.openTasks(filter)
            }
        case .dismissBanner:
            state.banner = nil
        }
        return nil
    }

    private func load() -> Task<Void, Never> {
        loadTask?.cancel()
        if state.content.value == nil {
            state.content = .loading
        }
        let startOfToday = CalendarDay.timestamp(for: now(), calendar: calendar)
        let task = Task {
            do throws(DomainError) {
                let summary = try await getSummary.execute(startOfToday: startOfToday)
                guard !Task.isCancelled else { return }
                state.content = .loaded(Self.content(for: summary))
            } catch {
                guard !Task.isCancelled, let message = error.message else { return }
                if state.content.value == nil {
                    state.content = .failed(message)
                } else {
                    state.banner = message
                }
            }
        }
        loadTask = task
        return task
    }

    static func content(for summary: DashboardSummary) -> DashboardViewState.Content {
        let percent = Int((summary.completionRate * 100).rounded())
        return DashboardViewState.Content(
            cards: [
                StatCardViewState(id: "total", title: "All tasks", value: "\(summary.total)", tone: .neutral, filter: .all),
                StatCardViewState(id: "todo", title: "To do", value: "\(summary.todo)", tone: .neutral, filter: .todo),
                StatCardViewState(id: "inProgress", title: "In progress", value: "\(summary.inProgress)", tone: .info, filter: .inProgress),
                StatCardViewState(id: "completed", title: "Completed", value: "\(summary.completed)", tone: .success, filter: .completed),
                StatCardViewState(id: "overdue", title: "Overdue", value: "\(summary.overdue)", tone: summary.overdue > 0 ? .danger : .neutral, filter: .overdue),
                StatCardViewState(
                    id: "dueSoon", title: "Due in \(DashboardSummary.dueSoonDays) days", value: "\(summary.dueSoon)",
                    tone: summary.dueSoon > 0 ? .warning : .neutral, filter: nil
                ),
                StatCardViewState(
                    id: "highPriority", title: "High priority open", value: "\(summary.highPriorityOpen)",
                    tone: summary.highPriorityOpen > 0 ? .danger : .neutral, filter: nil
                ),
            ],
            completionValue: summary.completionRate,
            completionText: "\(percent)% complete · \(summary.completed) of \(summary.total)",
            isEmpty: summary.total == 0
        )
    }
}
