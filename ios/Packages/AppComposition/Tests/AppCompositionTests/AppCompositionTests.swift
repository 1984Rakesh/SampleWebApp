import Foundation
import SwiftUI
import Testing
import UIKit
import AuthFeature
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
        #expect(tabs.viewControllers?.first === harness.tasksFlow.rootViewController)
        #expect(tabs.viewControllers?.map { $0.tabBarItem.title } == ["Tasks", "Account"])
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
    let resets = Counter()
    let coordinator: AppCoordinator

    init() {
        let (stream, continuation) = AsyncStream.makeStream(of: SessionState.self)
        changes = continuation
        let (authFlow, tasksFlow, resets) = (authFlow, tasksFlow, resets)
        coordinator = AppCoordinator(window: window, services: AppServices(
            restore: StubRestore(),
            observe: StubObserve(stream: stream),
            logout: StubLogout(),
            makeAuthFlow: { authFlow },
            makeTasksFlow: { tasksFlow },
            resetUserSessions: { resets.count += 1 }
        ))
    }
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

struct StubLogout: LogoutUseCase {
    func execute() async {}
}
