import Foundation
import SwiftUI
import Testing
import UIKit
import AuthFeature
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
        let (window, _, _, coordinator) = makeCoordinator()

        coordinator.start()

        #expect(window.rootViewController is UIHostingController<SplashScreen>)
    }

    @Test func signedOutShowsAuthFlowAndSignedInShowsHome() async throws {
        let (window, changes, flow, coordinator) = makeCoordinator()
        coordinator.start()

        changes.yield(.signedOut)
        try await waitUntil { window.rootViewController === flow.rootViewController }

        changes.yield(.signedIn(account))
        try await waitUntil { window.rootViewController is UIHostingController<SignedInPlaceholderScreen> }
    }

    @Test func repeatedStateDoesNotRebuildRoot() async throws {
        let (window, changes, _, coordinator) = makeCoordinator()
        coordinator.start()
        changes.yield(.signedIn(account))
        try await waitUntil { window.rootViewController is UIHostingController<SignedInPlaceholderScreen> }
        let home = window.rootViewController

        changes.yield(.signedIn(account))
        try await Task.sleep(for: .milliseconds(50))

        #expect(window.rootViewController === home)
    }

    private func makeCoordinator() -> (UIWindow, AsyncStream<SessionState>.Continuation, StubAuthFlow, AppCoordinator) {
        let window = UIWindow(frame: CGRect(x: 0, y: 0, width: 390, height: 844))
        let (stream, continuation) = AsyncStream.makeStream(of: SessionState.self)
        let flow = StubAuthFlow()
        let services = SessionServices(
            restore: StubRestore(),
            observe: StubObserve(stream: stream),
            logout: StubLogout(),
            makeAuthFlow: { flow }
        )
        return (window, continuation, flow, AppCoordinator(window: window, session: services))
    }

    private func waitUntil(_ condition: () -> Bool) async throws {
        for _ in 0..<100 where !condition() {
            try await Task.sleep(for: .milliseconds(10))
        }
        #expect(condition())
    }
}

final class StubAuthFlow: AuthFlow {
    let rootViewController = UIViewController()
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
