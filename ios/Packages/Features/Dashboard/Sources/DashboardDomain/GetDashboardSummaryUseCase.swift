import SharedDomain

public protocol GetDashboardSummaryUseCase: Sendable {
    /// `startOfToday` is the caller's "today", so overdue and due-soon follow the user's calendar.
    func execute(startOfToday: Timestamp) async throws(DomainError) -> DashboardSummary
}

package struct DefaultGetDashboardSummaryUseCase: GetDashboardSummaryUseCase {
    let source: any DashboardTaskSource

    package init(source: any DashboardTaskSource) {
        self.source = source
    }

    package func execute(startOfToday: Timestamp) async throws(DomainError) -> DashboardSummary {
        DashboardSummary(tasks: try await source.tasks(), startOfToday: startOfToday)
    }
}
