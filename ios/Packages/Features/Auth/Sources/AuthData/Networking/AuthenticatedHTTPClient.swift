import Networking

/// Adds the bearer token to every request. On a 401 it refreshes once (shared with concurrent requests)
/// and retries once; a second 401 ends the session (ios §4.4).
package struct AuthenticatedHTTPClient: HTTPClient {
    private let inner: any HTTPClient
    private let tokens: any SessionTokenSource

    package init(inner: any HTTPClient, tokens: any SessionTokenSource) {
        self.inner = inner
        self.tokens = tokens
    }

    package func send(_ endpoint: Endpoint) async throws(HTTPError) -> HTTPResponse {
        guard let token = await tokens.accessToken() else {
            throw .status(code: 401, message: Self.expiredMessage)
        }
        do {
            return try await inner.send(authorized(endpoint, token))
        } catch .status(code: 401, _) {
            guard let refreshed = await tokens.refreshedAccessToken(replacing: token) else {
                throw .status(code: 401, message: Self.expiredMessage)
            }
            do {
                return try await inner.send(authorized(endpoint, refreshed))
            } catch .status(code: 401, let message) {
                await tokens.expire()
                throw .status(code: 401, message: message)
            }
        }
    }

    static let expiredMessage = "Your session has expired. Please log in again."

    private func authorized(_ endpoint: Endpoint, _ token: String) -> Endpoint {
        var copy = endpoint
        copy.headers["Authorization"] = "Bearer \(token)"
        return copy
    }
}
