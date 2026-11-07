import Foundation
import Testing
import Networking
import SharedDomain
import TasksDomain
@testable import TasksData

/// Opt-in end-to-end checks against a running server. Enable with
/// `TEST_RUNNER_LIVE_API_BASE_URL=http://localhost:3001/api xcodebuild test …`.
private let liveBaseURL = ProcessInfo.processInfo.environment["LIVE_API_BASE_URL"].flatMap(URL.init(string:))

/// Adds a fixed bearer token, standing in for Auth's authenticated client.
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

@Suite(.enabled(if: liveBaseURL != nil, "Set TEST_RUNNER_LIVE_API_BASE_URL to run against a server"), .serialized)
struct LiveServerTests {
    private func signedInRepository() async throws -> APITaskRepository {
        let client = URLSessionHTTPClient(baseURL: try #require(liveBaseURL))
        let body = RegisterBody(name: "Live Tasks", email: "ios-tasks-\(UUID().uuidString.prefix(8))@example.com", password: "secret123")
        let token = try await client.send(try Endpoint.json(.post, "/auth/register", body: body)).decode(TokenBody.self).accessToken
        return APITaskRepository(client: BearerClient(inner: client, token: token))
    }

    @Test func createListUpdateToggleAndDelete() async throws {
        let repository = try await signedInRepository()
        let due = try #require(DueDateCoding.parse("2026-11-05"))

        let created = try await repository.create(NewTask(title: try TaskTitle(" Ship iOS "), details: "Notes", priority: .high, dueDate: due))
        #expect(created.title == "Ship iOS")
        #expect(created.status == .todo)
        #expect(created.dueDate == due)

        #expect(try await repository.tasks(filter: .all).map(\.id) == [created.id])
        #expect(try await repository.tasks(filter: TaskFilter(status: .completed)).isEmpty)

        let updated = try await repository.update(id: created.id, changes: TaskChanges(details: .clear, priority: .low, dueDate: .clear))
        #expect(updated.details == nil)
        #expect(updated.priority == .low)
        #expect(updated.dueDate == nil)
        #expect(updated.title == "Ship iOS")

        let completed = try await repository.setStatus(id: created.id, .completed)
        #expect(completed.status == .completed)
        #expect(try await repository.tasks(filter: TaskFilter(status: .completed)).map(\.id) == [created.id])

        try await repository.delete(id: created.id)
        #expect(try await repository.tasks(filter: .all).isEmpty)
        await #expect(throws: DomainError.notFound("Task not found")) {
            try await repository.delete(id: created.id)
        }
    }

    @Test func otherUsersTasksAreNotFound() async throws {
        let owner = try await signedInRepository()
        let stranger = try await signedInRepository()
        let created = try await owner.create(NewTask(title: try TaskTitle("Private"), details: nil, priority: .medium, dueDate: nil))

        #expect(try await stranger.tasks(filter: .all).isEmpty)
        await #expect(throws: DomainError.notFound("Task not found")) {
            try await stranger.setStatus(id: created.id, .completed)
        }
        await #expect(throws: DomainError.notFound("Task not found")) {
            try await stranger.delete(id: created.id)
        }
    }
}
