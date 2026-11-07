import Testing
import SharedDomain
@testable import DashboardDomain

private let day: Double = 86_400
private let today = Timestamp(secondsSince1970: 20_000 * day)

private func due(_ days: Double) -> Timestamp {
    Timestamp(secondsSince1970: today.secondsSince1970 + days * day)
}

@Suite struct DashboardSummaryTests {
    @Test func countsByStatusPriorityAndDueDate() {
        let summary = DashboardSummary(
            tasks: [
                DashboardTask(status: .todo, priority: .high, dueDate: due(-1)),
                DashboardTask(status: .inProgress, priority: .high, dueDate: due(0)),
                DashboardTask(status: .todo, priority: .low, dueDate: due(7)),
                DashboardTask(status: .todo, priority: .medium, dueDate: due(8)),
                DashboardTask(status: .completed, priority: .high, dueDate: due(-3)),
                DashboardTask(status: .completed, priority: .low, dueDate: nil),
            ],
            startOfToday: today
        )

        #expect(summary.total == 6)
        #expect(summary.todo == 3)
        #expect(summary.inProgress == 1)
        #expect(summary.completed == 2)
        #expect(summary.overdue == 1)
        #expect(summary.dueSoon == 2)
        #expect(summary.highPriorityOpen == 2)
        #expect(summary.completionRate == 2.0 / 6.0)
    }

    @Test func emptySummaryHasZeroCompletion() {
        let summary = DashboardSummary(tasks: [], startOfToday: today)

        #expect(summary.total == 0)
        #expect(summary.completionRate == 0)
    }

    @Test func useCaseReadsFromSourceAndPassesErrorsThrough() async throws {
        let ok = DefaultGetDashboardSummaryUseCase(source: StubSource(result: .success([DashboardTask(status: .completed, priority: .low, dueDate: nil)])))
        #expect(try await ok.execute(startOfToday: today).completed == 1)

        let failing = DefaultGetDashboardSummaryUseCase(source: StubSource(result: .failure(.unavailable("Offline"))))
        await #expect(throws: DomainError.unavailable("Offline")) { try await failing.execute(startOfToday: today) }
    }
}

private struct StubSource: DashboardTaskSource {
    let result: Result<[DashboardTask], DomainError>
    func tasks() async throws(DomainError) -> [DashboardTask] { try result.get() }
}
