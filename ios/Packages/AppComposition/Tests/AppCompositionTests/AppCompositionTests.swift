import Foundation
import SwiftUI
import Testing
import UIKit
import AuthFeature
import DashboardFeature
import ProfileFeature
import SharedDomain
import TasksFeature
@testable import AppComposition

@Suite struct AppConfigTests {
    @Test func loadsBaseURL() throws {
        let config = try AppConfig.load(from: ["APIBaseURL": "http://localhost:3001/api"])

        #expect(config.apiBaseURL == URL(string: "http://localhost:3001/api"))
    }

    @Test func missingKeyFails() {
        #expect(throws: AppConfig.LoadError.missingKey("APIBaseURL")) {
            try AppConfig.load(from: [:])
        }
    }

    @Test(arguments: ["localhost:3001", "ftp://example.com", "http://"])
    func invalidURLFails(text: String) {
        #expect(throws: AppConfig.LoadError.invalidURL(text)) {
            try AppConfig.load(from: ["APIBaseURL": text])
        }
    }
}

@Suite struct AppCoordinatorTests {
    private let account = Account(id: "u1", name: "Ada", email: "ada@example.com")

    @Test func startShowsSplashUntilSessionIsKnown() {
        let harness = Harness()

        harness.coordinator.start()

        #expect(harness.window.rootViewController is UIHostingController<SplashScreen>)
    }

    @Test func signedOutShowsAuthFlowAndSignedInShowsTabs() async throws {
        let harness = Harness()
        harness.coordinator.start()

        harness.changes.yield(.signedOut)
        try await waitUntil { harness.window.rootViewController === harness.authFlow.rootViewController }
        #expect(harness.resets.count == 1)

        harness.changes.yield(.signedIn(account))
        try await waitUntil { harness.window.rootViewController is UITabBarController }
        let tabs = try #require(harness.window.rootViewController as? UITabBarController)
        #expect(tabs.viewControllers?[1] === harness.tasksFlow.rootViewController)
        #expect(tabs.viewControllers?.map { $0.tabBarItem.title } == ["Dashboard", "Tasks", "Profile"])
        #expect(tabs.viewControllers?[2] === harness.profileFlow.rootViewController)
        #expect(harness.dashboards.flows.first?.displayName == "Ada")

        harness.dashboards.flows.first?.router?.openTasks(.overdue)
        #expect(tabs.selectedIndex == 1)
        #expect(harness.tasksFlow.routes == [.overdue])
    }

    @Test func repeatedStateDoesNotRebuildRoot() async throws {
        let harness = Harness()
        harness.coordinator.start()
        harness.changes.yield(.signedIn(account))
        try await waitUntil { harness.window.rootViewController is UITabBarController }
        let main = harness.window.rootViewController

        harness.changes.yield(.signedIn(account))
        try await Task.sleep(for: .milliseconds(50))

        #expect(harness.window.rootViewController === main)
    }

    private func waitUntil(_ condition: () -> Bool) async throws {
        for _ in 0..<100 where !condition() {
            try await Task.sleep(for: .milliseconds(10))
        }
        #expect(condition())
    }
}

final class Harness {
    let window = UIWindow(frame: CGRect(x: 0, y: 0, width: 390, height: 844))
    let changes: AsyncStream<SessionState>.Continuation
    let authFlow = StubAuthFlow()
    let tasksFlow = StubTasksFlow()
    let profileFlow = StubProfileFlow()
    let dashboards = DashboardRecorder()
    let resets = Counter()
    let coordinator: AppCoordinator

    init() {
        let (stream, continuation) = AsyncStream.makeStream(of: SessionState.self)
        changes = continuation
        let (authFlow, tasksFlow, profileFlow, resets) = (authFlow, tasksFlow, profileFlow, resets)
        let dashboards = dashboards
        coordinator = AppCoordinator(window: window, services: AppServices(
            restore: StubRestore(),
            observe: StubObserve(stream: stream),
            makeAuthFlow: { authFlow },
            makeTasksFlow: { tasksFlow },
            makeDashboardFlow: { name, router in dashboards.make(name, router) },
            makeProfileFlow: { profileFlow },
            resetUserSessions: { resets.count += 1 }
        ))
    }
}

final class StubProfileFlow: ProfileFlow {
    let rootViewController = UIViewController()
}

final class DashboardRecorder {
    private(set) var flows: [StubDashboardFlow] = []

    func make(_ name: String, _ router: any DashboardExternalRouting) -> StubDashboardFlow {
        let flow = StubDashboardFlow(displayName: name, router: router)
        flows.append(flow)
        return flow
    }
}

final class StubDashboardFlow: DashboardFlow {
    let rootViewController = UIViewController()
    let displayName: String
    weak var router: (any DashboardExternalRouting)?

    init(displayName: String, router: any DashboardExternalRouting) {
        self.displayName = displayName
        self.router = router
    }
}

@Suite struct CrossFeatureAdapterTests {
    @Test func mapsTasksToDashboardTasks() async throws {
        let due = Timestamp(secondsSince1970: 100)
        let task = TaskItem(
            id: TaskID("1"), title: "a", details: nil, status: .inProgress, priority: .high,
            dueDate: due, createdAt: due, updatedAt: due
        )
        let source = TasksDashboardSource(getTasks: { StubGetTasks(tasks: [task]) })

        #expect(try await source.tasks() == [DashboardTask(status: .inProgress, priority: .high, dueDate: due)])
    }

    @Test(arguments: [
        (DashboardTaskFilter.all, TasksRoute.list(status: nil)),
        (.todo, .list(status: .todo)),
        (.inProgress, .list(status: .inProgress)),
        (.completed, .list(status: .completed)),
        (.overdue, .overdue),
    ])
    func mapsDashboardFiltersToTasksRoutes(filter: DashboardTaskFilter, route: TasksRoute) {
        #expect(TasksRouteBridge.route(for: filter) == route)
    }
}

@Suite struct SessionEndingAdapterTests {
    @Test func endsSessionThroughAuthLogout() async {
        let logout = RecordingLogout()

        await AuthSessionEnding(logout: logout).endSession()

        #expect(await logout.calls == 1)
    }
}

actor RecordingLogout: LogoutUseCase {
    private(set) var calls = 0
    func execute() async { calls += 1 }
}

struct StubGetTasks: GetTasksUseCase {
    let tasks: [TaskItem]
    func execute(_ filter: TaskFilter) async throws(DomainError) -> [TaskItem] { tasks }
}

final class Counter {
    var count = 0
}

final class StubAuthFlow: AuthFlow {
    let rootViewController = UIViewController()
}

final class StubTasksFlow: TasksFlow {
    let rootViewController = UIViewController()
    private(set) var routes: [TasksRoute] = []
    func handle(_ route: TasksRoute) { routes.append(route) }
}

struct StubRestore: RestoreSessionUseCase {
    func execute() async -> SessionState { .signedOut }
}

struct StubObserve: ObserveSessionUseCase {
    let stream: AsyncStream<SessionState>
    func execute() async -> AsyncStream<SessionState> { stream }
}
