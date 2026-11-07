import Factory
import FactoryTesting
import Foundation
import Testing
import DesignSystem
import SharedDomain
import DashboardDomain
@testable import DashboardPresentation

extension Trait where Self == ContainerTrait<DashboardContainer> {
    /// A fresh `DashboardContainer` per test (ios §7.5).
    static var dashboardContainer: ContainerTrait<DashboardContainer> {
        .init(shared: DashboardContainer.$shared, container: DashboardContainer())
    }
}

actor StubSource: DashboardTaskSource {
    private var result: Result<[DashboardTask], DomainError>

    init(_ result: Result<[DashboardTask], DomainError>) {
        self.result = result
    }

    func set(_ result: Result<[DashboardTask], DomainError>) { self.result = result }
    func tasks() async throws(DomainError) -> [DashboardTask] { try result.get() }
}

final class SpyRouter: DashboardExternalRouting {
    private(set) var opened: [DashboardTaskFilter] = []
    func openTasks(_ filter: DashboardTaskFilter) { opened.append(filter) }
}

private var utc: Calendar {
    var calendar = Calendar(identifier: .gregorian)
    calendar.timeZone = .gmt
    return calendar
}

/// 2026-10-30 10:00 UTC.
private let now = Date(timeIntervalSince1970: 1_793_354_400)
private let yesterday = Timestamp(secondsSince1970: 1_793_318_400 - 86_400)

@Suite(.dashboardContainer) struct DashboardViewModelTests {
    private func makeSUT(_ source: StubSource, router: SpyRouter = SpyRouter(), name: String = "Ada") -> DashboardViewModel {
        DashboardContainer.shared.taskSource.register { source }
        return DashboardViewModel(displayName: name, router: router, now: { now }, calendar: utc)
    }

    @Test func loadsCardsAndProgress() async throws {
        let sut = makeSUT(StubSource(.success([
            DashboardTask(status: .completed, priority: .low, dueDate: nil),
            DashboardTask(status: .todo, priority: .high, dueDate: yesterday),
        ])))
        #expect(sut.state.greeting == "Hello, Ada")

        await sut.send(.onAppear)?.value

        let content = try #require(sut.state.content.value)
        #expect(content.completionText == "50% complete · 1 of 2")
        #expect(content.cards.first { $0.id == "overdue" }?.value == "1")
        #expect(content.cards.first { $0.id == "overdue" }?.tone == .danger)
        #expect(content.cards.first { $0.id == "highPriority" }?.value == "1")
        #expect(!content.isEmpty)
    }

    @Test func tappableCardsOpenTasksWithTheirFilter() async {
        let router = SpyRouter()
        let sut = makeSUT(StubSource(.success([])), router: router)
        await sut.send(.onAppear)?.value

        sut.send(.cardTapped(id: "overdue"))
        sut.send(.cardTapped(id: "completed"))
        sut.send(.cardTapped(id: "dueSoon"))

        #expect(router.opened == [.overdue, .completed])
    }

    @Test func failureThenBannerOnLaterFailure() async {
        let source = StubSource(.failure(.unavailable("Offline")))
        let sut = makeSUT(source, name: "")
        #expect(sut.state.greeting == "Welcome back")

        await sut.send(.onAppear)?.value
        #expect(sut.state.content == .failed("Offline"))

        await source.set(.success([]))
        await sut.send(.refresh)?.value
        #expect(sut.state.content.value?.isEmpty == true)

        await source.set(.failure(.unavailable("Offline")))
        await sut.send(.refresh)?.value
        #expect(sut.state.content.value != nil)
        #expect(sut.state.banner == "Offline")
    }
}
