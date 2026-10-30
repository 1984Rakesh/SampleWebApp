import AuthDomain
import Foundation
import Networking
import SharedDomain

/// Gives `AuthenticatedHTTPClient` the current access token and a coalesced refresh.
package protocol SessionTokenSource: Sendable {
    func accessToken() async -> String?
    /// A fresh access token after `rejectedToken` got a 401, or `nil` once the session has ended.
    func refreshedAccessToken(replacing rejectedToken: String) async -> String?
    /// Ends the session after the server rejected even a fresh token.
    func expire() async
}

/// The single owner of the session: Keychain copy, in-memory copy, refresh and change notifications.
///
/// An actor, so a sign-out during a refresh can never be overwritten by the refresh's result (client §5.3).
package actor APISessionRepository: SessionRepository, SessionTokenSource {
    private let client: any HTTPClient
    private let store: any TokenStore
    private var session: StoredSession?
    private var refreshTask: Task<String?, Never>?
    private var subscribers: [UUID: AsyncStream<SessionState>.Continuation] = [:]

    /// `client` must not be the authenticated client: refresh uses a separate, non-intercepted transport.
    package init(client: any HTTPClient, store: any TokenStore) {
        self.client = client
        self.store = store
    }

    // MARK: SessionRepository

    package func restore() async -> SessionState {
        guard let stored = store.load(), SessionMapper.account(from: stored) != nil else {
            store.clear()
            replace(with: nil)
            return .signedOut
        }
        replace(with: stored)
        return state
    }

    package func login(_ credentials: LoginCredentials) async throws(DomainError) -> Account {
        let body = LoginRequestDTO(email: credentials.email.value, password: credentials.password.value)
        return try await authenticate(try jsonEndpoint("/auth/login", body: body))
    }

    package func register(_ registration: Registration) async throws(DomainError) -> Account {
        let body = RegisterRequestDTO(
            name: registration.name.value,
            email: registration.email.value,
            password: registration.password.value
        )
        return try await authenticate(try jsonEndpoint("/auth/register", body: body))
    }

    package func logout() async {
        endSession()
    }

    package func sessionChanges() async -> AsyncStream<SessionState> {
        let (stream, continuation) = AsyncStream.makeStream(of: SessionState.self, bufferingPolicy: .bufferingNewest(1))
        let id = UUID()
        subscribers[id] = continuation
        continuation.yield(state)
        continuation.onTermination = { [weak self] _ in
            Task { await self?.unsubscribe(id) }
        }
        return stream
    }

    // MARK: SessionTokenSource

    package func accessToken() async -> String? {
        session?.accessToken
    }

    package func refreshedAccessToken(replacing rejectedToken: String) async -> String? {
        guard let current = session else { return nil }
        if current.accessToken != rejectedToken {
            return current.accessToken
        }
        if let refreshTask {
            return await refreshTask.value
        }
        let task = Task { await self.refresh(using: current.refreshToken) }
        refreshTask = task
        let token = await task.value
        refreshTask = nil
        return token
    }

    package func expire() async {
        endSession()
    }

    // MARK: Private

    private var state: SessionState {
        guard let session, let account = SessionMapper.account(from: session) else { return .signedOut }
        return .signedIn(account)
    }

    private func jsonEndpoint(_ path: String, body: some Encodable) throws(DomainError) -> Endpoint {
        do {
            return try Endpoint.json(.post, path, body: body)
        } catch {
            throw error.domainError
        }
    }

    private func authenticate(_ endpoint: Endpoint) async throws(DomainError) -> Account {
        let stored: StoredSession
        do {
            let response = try await client.send(endpoint)
            stored = try SessionMapper.storedSession(from: response.decode(AuthResponseDTO.self))
        } catch let error as HTTPError {
            throw error.domainError
        } catch let error as DomainError {
            throw error
        } catch {
            throw SessionMapper.unexpectedResponse
        }
        try store.save(stored)
        replace(with: stored)
        guard let account = SessionMapper.account(from: stored) else { throw SessionMapper.unexpectedResponse }
        return account
    }

    /// Exchanges the refresh token. A failed refresh, or a sign-out meanwhile, ends or leaves the session ended.
    private func refresh(using refreshToken: String) async -> String? {
        let accessToken: String?
        do {
            let endpoint = try Endpoint.json(.post, "/auth/refresh", body: RefreshRequestDTO(refreshToken: refreshToken))
            accessToken = SessionMapper.accessToken(from: try await client.send(endpoint).decode(RefreshResponseDTO.self))
        } catch {
            accessToken = nil
        }
        // Stale result: the session was cleared or replaced while the request was in flight.
        guard var current = session, current.refreshToken == refreshToken else { return nil }
        guard let accessToken else {
            endSession()
            return nil
        }
        current.accessToken = accessToken
        do {
            try store.save(current)
        } catch {
            endSession()
            return nil
        }
        session = current
        return accessToken
    }

    private func endSession() {
        store.clear()
        replace(with: nil)
    }

    private func replace(with newSession: StoredSession?) {
        let wasSignedIn = state
        session = newSession
        if state != wasSignedIn {
            subscribers.values.forEach { $0.yield(state) }
        }
    }

    private func unsubscribe(_ id: UUID) {
        subscribers[id] = nil
    }
}
