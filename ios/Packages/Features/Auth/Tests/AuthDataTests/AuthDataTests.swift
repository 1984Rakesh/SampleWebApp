import Foundation
import Testing
import os
import Networking
import SharedDomain
import AuthDomain
@testable import AuthData

// MARK: - Doubles

/// Answers requests from a handler and records every endpoint it sends.
struct StubHTTPClient: HTTPClient {
    typealias Handler = @Sendable (Endpoint) async throws(HTTPError) -> HTTPResponse

    private let handler: Handler
    private let log = OSAllocatedUnfairLock<[Endpoint]>(initialState: [])

    init(_ handler: @escaping Handler) {
        self.handler = handler
    }

    var sent: [Endpoint] { log.withLock { $0 } }

    func send(_ endpoint: Endpoint) async throws(HTTPError) -> HTTPResponse {
        log.withLock { $0.append(endpoint) }
        return try await handler(endpoint)
    }
}

struct MemoryTokenStore: TokenStore {
    private let value: OSAllocatedUnfairLock<StoredSession?>

    init(_ session: StoredSession? = nil) {
        value = OSAllocatedUnfairLock(initialState: session)
    }

    var current: StoredSession? { value.withLock { $0 } }

    func load() -> StoredSession? { current }
    func save(_ session: StoredSession) throws(DomainError) { value.withLock { $0 = session } }
    func clear() { value.withLock { $0 = nil } }
}

enum Fixtures {
    static let account = Account(id: "u1", name: "Ada", email: "ada@example.com")

    static func session(access: String = "access-1", refresh: String = "refresh-1") -> StoredSession {
        StoredSession(accessToken: access, refreshToken: refresh, account: .init(id: "u1", name: "Ada", email: "ada@example.com"))
    }

    static func json(_ text: String, status: Int = 200) -> HTTPResponse {
        HTTPResponse(status: status, data: Data(text.utf8))
    }

    static let authResponse = json(#"""
    {"user":{"id":"u1","name":"Ada","email":"ada@example.com","avatar":null,"bio":null,"createdAt":"2026-10-30T12:00:00.000Z"},
     "accessToken":"access-1","refreshToken":"refresh-1"}
    """#)

    static func credentials() throws -> LoginCredentials {
        LoginCredentials(email: try EmailAddress("ada@example.com"), password: try .existing("secret"))
    }
}

// MARK: - Session repository

@Suite struct APISessionRepositoryTests {
    @Test func loginStoresSessionAndNotifiesSubscribers() async throws {
        let store = MemoryTokenStore()
        let client = StubHTTPClient { _ throws(HTTPError) in Fixtures.authResponse }
        let sut = APISessionRepository(client: client, store: store)
        var changes = await sut.sessionChanges().makeAsyncIterator()
        #expect(await changes.next() == .signedOut)

        let account = try await sut.login(try Fixtures.credentials())

        #expect(account == Fixtures.account)
        #expect(await changes.next() == .signedIn(Fixtures.account))
        #expect(store.current == Fixtures.session())
        #expect(client.sent.first?.path == "/auth/login")
        let body = try #require(client.sent.first?.body)
        #expect(String(decoding: body, as: UTF8.self).contains(#""email":"ada@example.com""#))
    }

    @Test func rejectedLoginKeepsBackendMessage() async throws {
        let client = StubHTTPClient { _ throws(HTTPError) in
            throw .status(code: 401, message: "Invalid email or password")
        }
        let sut = APISessionRepository(client: client, store: MemoryTokenStore())

        await #expect(throws: DomainError.unauthorized("Invalid email or password")) {
            try await sut.login(try Fixtures.credentials())
        }
    }

    @Test func malformedAuthResponseIsUnavailable() async throws {
        let store = MemoryTokenStore()
        let client = StubHTTPClient { _ throws(HTTPError) in Fixtures.json(#"{"user":{"id":"u1"},"accessToken":"a"}"#) }
        let sut = APISessionRepository(client: client, store: store)

        await #expect(throws: DomainError.unavailable("Unexpected server response")) {
            try await sut.login(try Fixtures.credentials())
        }
        #expect(store.current == nil)
    }

    @Test func restoreUsesStoredSession() async {
        let sut = APISessionRepository(client: StubHTTPClient { _ throws(HTTPError) in Fixtures.authResponse }, store: MemoryTokenStore(Fixtures.session()))

        #expect(await sut.restore() == .signedIn(Fixtures.account))
        #expect(await sut.accessToken() == "access-1")
    }

    @Test func restoreClearsIncompleteSession() async {
        let store = MemoryTokenStore(Fixtures.session(access: " "))
        let sut = APISessionRepository(client: StubHTTPClient { _ throws(HTTPError) in Fixtures.authResponse }, store: store)

        #expect(await sut.restore() == .signedOut)
        #expect(store.current == nil)
    }

    @Test func logoutClearsSessionAndNotifies() async {
        let store = MemoryTokenStore(Fixtures.session())
        let sut = APISessionRepository(client: StubHTTPClient { _ throws(HTTPError) in Fixtures.authResponse }, store: store)
        _ = await sut.restore()
        var changes = await sut.sessionChanges().makeAsyncIterator()
        #expect(await changes.next() == .signedIn(Fixtures.account))

        await sut.logout()

        #expect(await changes.next() == .signedOut)
        #expect(store.current == nil)
    }

    @Test func concurrentRefreshesShareOneRequest() async {
        let store = MemoryTokenStore(Fixtures.session())
        let client = StubHTTPClient { _ throws(HTTPError) in
            try? await Task.sleep(for: .milliseconds(50))
            return Fixtures.json(#"{"accessToken":"access-2"}"#)
        }
        let sut = APISessionRepository(client: client, store: store)
        _ = await sut.restore()

        async let first = sut.refreshedAccessToken(replacing: "access-1")
        async let second = sut.refreshedAccessToken(replacing: "access-1")
        let tokens = await [first, second]

        #expect(tokens == ["access-2", "access-2"])
        #expect(client.sent.count == 1)
        #expect(store.current?.accessToken == "access-2")
        #expect(await sut.refreshedAccessToken(replacing: "access-1") == "access-2")
    }

    @Test func failedRefreshEndsSession() async {
        let store = MemoryTokenStore(Fixtures.session())
        let client = StubHTTPClient { _ throws(HTTPError) in throw .status(code: 401, message: "Invalid refresh token") }
        let sut = APISessionRepository(client: client, store: store)
        _ = await sut.restore()

        #expect(await sut.refreshedAccessToken(replacing: "access-1") == nil)
        #expect(store.current == nil)
        #expect(await sut.accessToken() == nil)
    }

    @Test func logoutDuringRefreshIsNotRevived() async {
        let store = MemoryTokenStore(Fixtures.session())
        let client = StubHTTPClient { _ throws(HTTPError) in
            try? await Task.sleep(for: .milliseconds(100))
            return Fixtures.json(#"{"accessToken":"access-2"}"#)
        }
        let sut = APISessionRepository(client: client, store: store)
        _ = await sut.restore()

        async let refreshed = sut.refreshedAccessToken(replacing: "access-1")
        try? await Task.sleep(for: .milliseconds(20))
        await sut.logout()

        #expect(await refreshed == nil)
        #expect(store.current == nil)
        #expect(await sut.accessToken() == nil)
    }
}

// MARK: - Authenticated client

@Suite struct AuthenticatedHTTPClientTests {
    private func repository(store: MemoryTokenStore, refresh: @escaping StubHTTPClient.Handler) async -> APISessionRepository {
        let repository = APISessionRepository(client: StubHTTPClient(refresh), store: store)
        _ = await repository.restore()
        return repository
    }

    @Test func addsBearerToken() async throws {
        let tokens = await repository(store: MemoryTokenStore(Fixtures.session())) { _ throws(HTTPError) in Fixtures.json("{}") }
        let api = StubHTTPClient { _ throws(HTTPError) in Fixtures.json("[]") }

        _ = try await AuthenticatedHTTPClient(inner: api, tokens: tokens).send(Endpoint(method: .get, path: "/tasks"))

        #expect(api.sent.first?.headers["Authorization"] == "Bearer access-1")
    }

    @Test func refreshesOnceThenRetries() async throws {
        let tokens = await repository(store: MemoryTokenStore(Fixtures.session())) { _ throws(HTTPError) in
            Fixtures.json(#"{"accessToken":"access-2"}"#)
        }
        let api = StubHTTPClient { endpoint throws(HTTPError) in
            guard endpoint.headers["Authorization"] == "Bearer access-2" else { throw .status(code: 401, message: "Invalid token") }
            return Fixtures.json("[]")
        }

        let response = try await AuthenticatedHTTPClient(inner: api, tokens: tokens).send(Endpoint(method: .get, path: "/tasks"))

        #expect(response.status == 200)
        #expect(api.sent.map { $0.headers["Authorization"] } == ["Bearer access-1", "Bearer access-2"])
    }

    @Test func secondUnauthorizedEndsSession() async {
        let store = MemoryTokenStore(Fixtures.session())
        let tokens = await repository(store: store) { _ throws(HTTPError) in Fixtures.json(#"{"accessToken":"access-2"}"#) }
        let api = StubHTTPClient { _ throws(HTTPError) in throw .status(code: 401, message: "Invalid token") }

        await #expect(throws: HTTPError.status(code: 401, message: "Invalid token")) {
            try await AuthenticatedHTTPClient(inner: api, tokens: tokens).send(Endpoint(method: .get, path: "/tasks"))
        }
        #expect(store.current == nil)
        #expect(api.sent.count == 2)
    }

    @Test func signedOutFailsWithoutCallingAPI() async {
        let tokens = await repository(store: MemoryTokenStore()) { _ throws(HTTPError) in Fixtures.json("{}") }
        let api = StubHTTPClient { _ throws(HTTPError) in Fixtures.json("[]") }

        await #expect(throws: HTTPError.status(code: 401, message: AuthenticatedHTTPClient.expiredMessage)) {
            try await AuthenticatedHTTPClient(inner: api, tokens: tokens).send(Endpoint(method: .get, path: "/tasks"))
        }
        #expect(api.sent.isEmpty)
    }

    @Test func otherErrorsPassThroughWithoutRefresh() async {
        let tokens = await repository(store: MemoryTokenStore(Fixtures.session())) { _ throws(HTTPError) in Fixtures.json("{}") }
        let api = StubHTTPClient { _ throws(HTTPError) in throw .status(code: 404, message: "Task not found") }

        await #expect(throws: HTTPError.status(code: 404, message: "Task not found")) {
            try await AuthenticatedHTTPClient(inner: api, tokens: tokens).send(Endpoint(method: .get, path: "/tasks/1"))
        }
        #expect(api.sent.count == 1)
    }
}
