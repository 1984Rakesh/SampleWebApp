import Foundation
import Testing
import os
import Networking
import SharedDomain
import ProfileDomain
@testable import ProfileData

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

private let profileJSON = #"""
{"id":"u1","name":" Ada ","email":"ada@example.com","avatar":"","bio":" Writes programs ","createdAt":"2026-10-01T09:00:00.000Z"}
"""#

private func response(_ text: String, status: Int = 200) -> HTTPResponse {
    HTTPResponse(status: status, data: Data(text.utf8))
}

@Suite struct ProfileDataTests {
    @Test func readsAndNormalizesProfile() async throws {
        let client = StubHTTPClient { _ throws(HTTPError) in response(profileJSON) }

        let profile = try await APIProfileRepository(client: client).currentProfile()

        #expect(client.sent.first?.path == "/users/me")
        #expect(profile.name == "Ada")
        #expect(profile.avatar == nil)
        #expect(profile.bio == "Writes programs")
    }

    @Test(arguments: [
        #"{"name":"Ada","email":"ada@example.com","createdAt":"2026-10-01T09:00:00Z"}"#,
        #"{"id":"u1","name":"Ada","email":" ","createdAt":"2026-10-01T09:00:00Z"}"#,
        #"{"id":"u1","name":"Ada","email":"ada@example.com","createdAt":"yesterday"}"#,
    ])
    func rejectsIncompleteProfiles(json: String) async {
        let client = StubHTTPClient { _ throws(HTTPError) in response(json) }

        await #expect(throws: DomainError.unavailable("Unexpected server response")) {
            try await APIProfileRepository(client: client).currentProfile()
        }
    }

    @Test func updateSendsTriStateBody() async throws {
        let client = StubHTTPClient { _ throws(HTTPError) in response(profileJSON) }

        _ = try await APIProfileRepository(client: client).update(ProfileChanges(name: try ProfileName("Ada L"), bio: .clear))

        let endpoint = try #require(client.sent.first)
        let body = try #require(endpoint.body)
        let json = try #require(try JSONSerialization.jsonObject(with: body) as? [String: Any])
        #expect(endpoint.method == .put)
        #expect(json["name"] as? String == "Ada L")
        #expect(json["bio"] is NSNull)
        #expect(json.keys.contains("avatar") == false)
    }

    @Test func serverValidationKeepsMessage() async throws {
        let client = StubHTTPClient { _ throws(HTTPError) in throw .status(code: 400, message: "Name cannot be empty") }

        await #expect(throws: DomainError.validation("Name cannot be empty")) {
            try await APIProfileRepository(client: client).update(ProfileChanges(bio: .clear))
        }
    }
}

/// Opt-in end-to-end check against a running server. Enable with
/// `TEST_RUNNER_LIVE_API_BASE_URL=http://localhost:3001/api xcodebuild test …`.
private let liveBaseURL = ProcessInfo.processInfo.environment["LIVE_API_BASE_URL"].flatMap(URL.init(string:))

private struct BearerClient: HTTPClient {
    let inner: any HTTPClient
    let token: String

    func send(_ endpoint: Endpoint) async throws(HTTPError) -> HTTPResponse {
        var authorized = endpoint
        authorized.headers["Authorization"] = "Bearer \(token)"
        return try await inner.send(authorized)
    }
}

private struct RegisterBody: Encodable {
    let name: String
    let email: String
    let password: String
}

private struct TokenBody: Decodable {
    let accessToken: String
}

@Suite(.enabled(if: liveBaseURL != nil, "Set TEST_RUNNER_LIVE_API_BASE_URL to run against a server"))
struct LiveProfileTests {
    @Test func readUpdateAndClearBio() async throws {
        let client = URLSessionHTTPClient(baseURL: try #require(liveBaseURL))
        let email = "ios-profile-\(UUID().uuidString.prefix(8).lowercased())@example.com"
        let body = RegisterBody(name: "Live Profile", email: email, password: "secret123")
        let token = try await client.send(try Endpoint.json(.post, "/auth/register", body: body)).decode(TokenBody.self).accessToken
        let repository = APIProfileRepository(client: BearerClient(inner: client, token: token))

        let profile = try await repository.currentProfile()
        #expect(profile.email == email)
        #expect(profile.name == "Live Profile")

        let updated = try await repository.update(ProfileChanges(name: try ProfileName("Renamed"), bio: .set("Hello")))
        #expect(updated.name == "Renamed")
        #expect(updated.bio == "Hello")

        let cleared = try await repository.update(ProfileChanges(bio: .clear))
        #expect(cleared.bio == nil)
        #expect(cleared.name == "Renamed")
    }
}
