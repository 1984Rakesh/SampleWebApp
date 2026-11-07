import Foundation
import Testing
import Networking
import SharedDomain
import AuthDomain
@testable import AuthData

/// Opt-in end-to-end checks against a running server. Enable with
/// `TEST_RUNNER_LIVE_API_BASE_URL=http://localhost:3001/api xcodebuild test …`.
private let liveBaseURL = ProcessInfo.processInfo.environment["LIVE_API_BASE_URL"].flatMap(URL.init(string:))

@Suite(.enabled(if: liveBaseURL != nil, "Set TEST_RUNNER_LIVE_API_BASE_URL to run against a server"), .serialized)
struct LiveServerTests {
    private let client = URLSessionHTTPClient(baseURL: liveBaseURL ?? URL(string: "http://localhost")!)

    private func registration() throws -> Registration {
        Registration(
            name: try PersonName("Live Test"),
            email: try EmailAddress("ios-\(UUID().uuidString.prefix(8))@example.com"),
            password: try .new("secret123")
        )
    }

    @Test func registerLoginRefreshAndLogout() async throws {
        let details = try registration()
        let store = MemoryTokenStore()
        let repository = APISessionRepository(client: client, store: store)

        let registered = try await repository.register(details)
        #expect(registered.email == details.email.value)
        #expect(await repository.restore() == .signedIn(registered))

        // A fresh repository restores from storage, as on relaunch.
        let relaunched = APISessionRepository(client: client, store: store)
        #expect(await relaunched.restore() == .signedIn(registered))

        // An invalid access token is refreshed once and the request retried.
        let stored = try #require(store.current)
        let expired = MemoryTokenStore(StoredSession(accessToken: "expired", refreshToken: stored.refreshToken, account: stored.account))
        let expiredRepository = APISessionRepository(client: client, store: expired)
        _ = await expiredRepository.restore()
        let authenticated = AuthenticatedHTTPClient(inner: client, tokens: expiredRepository)
        let me = try await authenticated.send(Endpoint(method: .get, path: "/users/me"))
        #expect(me.status == 200)
        #expect(expired.current?.accessToken != "expired")

        await relaunched.logout()
        #expect(await relaunched.restore() == .signedOut)
        #expect(store.current == nil)

        let loggedIn = try await APISessionRepository(client: client, store: MemoryTokenStore())
            .login(LoginCredentials(email: details.email, password: try .existing("secret123")))
        #expect(loggedIn == registered)
    }

    @Test func duplicateRegistrationAndBadPasswordKeepServerMessages() async throws {
        let details = try registration()
        let repository = APISessionRepository(client: client, store: MemoryTokenStore())
        _ = try await repository.register(details)

        await #expect {
            try await repository.register(details)
        } throws: { error in
            guard case .conflict(let message) = error as? DomainError else { return false }
            return !message.isEmpty
        }
        await #expect {
            try await repository.login(LoginCredentials(email: details.email, password: try .existing("wrong-password")))
        } throws: { error in
            guard case .unauthorized(let message) = error as? DomainError else { return false }
            return !message.isEmpty
        }
    }

    @Test func invalidRefreshTokenEndsSession() async throws {
        let store = MemoryTokenStore(StoredSession(
            accessToken: "expired",
            refreshToken: "not-a-real-token",
            account: .init(id: "u1", name: "Ada", email: "ada@example.com")
        ))
        let repository = APISessionRepository(client: client, store: store)
        _ = await repository.restore()

        await #expect(throws: HTTPError.self) {
            try await AuthenticatedHTTPClient(inner: client, tokens: repository).send(Endpoint(method: .get, path: "/users/me"))
        }
        #expect(await repository.restore() == .signedOut)
        #expect(store.current == nil)
    }
}
