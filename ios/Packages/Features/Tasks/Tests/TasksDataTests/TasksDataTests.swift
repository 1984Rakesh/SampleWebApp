import Foundation
import Testing
import os
import Networking
import SharedDomain
import TasksDomain
@testable import TasksData

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

enum DataFixtures {
    static let taskJSON = #"""
    {"id":"t1","title":" Write notes ","description":"","status":"IN_PROGRESS","priority":"HIGH",
     "dueDate":"2026-10-30","userId":"u1","createdAt":"2026-10-01T09:00:00.000Z","updatedAt":"2026-10-02T09:00:00.000Z"}
    """#

    static func response(_ text: String, status: Int = 200) -> HTTPResponse {
        HTTPResponse(status: status, data: Data(text.utf8))
    }

    static func body(_ endpoint: Endpoint?) throws -> [String: Any] {
        let data = try #require(endpoint?.body)
        return try #require(try JSONSerialization.jsonObject(with: data) as? [String: Any])
    }
}

@Suite struct TaskMapperTests {
    @Test func normalizesThenBuildsTask() throws {
        let dto = try JSONDecoder().decode(TaskResponseDTO.self, from: Data(DataFixtures.taskJSON.utf8))

        let task = try TaskMapper.task(from: dto)

        #expect(task.id == TaskID("t1"))
        #expect(task.title == "Write notes")
        #expect(task.details == nil)
        #expect(task.status == .inProgress)
        #expect(task.priority == .high)
        #expect(task.dueDate.map(DueDateCoding.format) == "2026-10-30")
    }

    @Test func acceptsFullISODueDates() throws {
        let timestamp = try #require(DueDateCoding.parse("2026-10-30T15:30:00.000Z"))
        #expect(DueDateCoding.format(timestamp) == "2026-10-30")
    }

    @Test(arguments: [
        #"{"id":"t1","title":"a","status":"DONE","priority":"LOW","createdAt":"2026-10-01T09:00:00Z","updatedAt":"2026-10-01T09:00:00Z"}"#,
        #"{"id":"t1","title":" ","status":"TODO","priority":"LOW","createdAt":"2026-10-01T09:00:00Z","updatedAt":"2026-10-01T09:00:00Z"}"#,
        #"{"title":"a","status":"TODO","priority":"LOW","createdAt":"2026-10-01T09:00:00Z","updatedAt":"2026-10-01T09:00:00Z"}"#,
        #"{"id":"t1","title":"a","status":"TODO","priority":"LOW","dueDate":"soon","createdAt":"2026-10-01T09:00:00Z","updatedAt":"2026-10-01T09:00:00Z"}"#,
        #"{"id":"t1","title":"a","status":"TODO","priority":"LOW","updatedAt":"2026-10-01T09:00:00Z"}"#,
    ])
    func rejectsInvalidTasksInsteadOfFabricating(json: String) throws {
        let dto = try JSONDecoder().decode(TaskResponseDTO.self, from: Data(json.utf8))
        #expect(throws: DomainError.unavailable("Unexpected server response")) { try TaskMapper.task(from: dto) }
    }

    @Test func updateRequestKeepsTriState() throws {
        let due = try #require(DueDateCoding.parse("2026-11-02"))
        let request = TaskMapper.updateRequest(from: TaskChanges(details: .clear, priority: .low, dueDate: .set(due)))
        let json = try JSONSerialization.jsonObject(with: JSONEncoder().encode(request)) as? [String: Any]

        #expect(json?["description"] is NSNull)
        #expect(json?["dueDate"] as? String == "2026-11-02")
        #expect(json?["priority"] as? String == "LOW")
        #expect(json?.keys.contains("title") == false)
        #expect(json?.keys.contains("status") == false)
    }
}

@Suite struct APITaskRepositoryTests {
    @Test func listSendsFilterQueryAndMapsTasks() async throws {
        let client = StubHTTPClient { _ throws(HTTPError) in DataFixtures.response("[\(DataFixtures.taskJSON)]") }

        let tasks = try await APITaskRepository(client: client).tasks(filter: TaskFilter(status: .completed, priority: .high))

        #expect(tasks.map(\.id) == [TaskID("t1")])
        #expect(client.sent.first?.path == "/tasks")
        #expect(client.sent.first?.query == [URLQueryItem(name: "status", value: "COMPLETED"), URLQueryItem(name: "priority", value: "HIGH")])
    }

    @Test func createPostsBody() async throws {
        let client = StubHTTPClient { _ throws(HTTPError) in DataFixtures.response(DataFixtures.taskJSON, status: 201) }
        let new = NewTask(title: try TaskTitle("Write notes"), details: "x", priority: .high, dueDate: DueDateCoding.parse("2026-10-30"))

        _ = try await APITaskRepository(client: client).create(new)

        let body = try DataFixtures.body(client.sent.first)
        #expect(client.sent.first?.method == .post)
        #expect(body["title"] as? String == "Write notes")
        #expect(body["priority"] as? String == "HIGH")
        #expect(body["dueDate"] as? String == "2026-10-30")
    }

    @Test func statusAndDeleteUseTheirEndpoints() async throws {
        let client = StubHTTPClient { endpoint throws(HTTPError) in
            endpoint.method == .delete ? DataFixtures.response("", status: 204) : DataFixtures.response(DataFixtures.taskJSON)
        }
        let repository = APITaskRepository(client: client)

        _ = try await repository.setStatus(id: TaskID("t1"), .completed)
        try await repository.delete(id: TaskID("t1"))

        #expect(client.sent.map(\.path) == ["/tasks/t1/status", "/tasks/t1"])
        #expect(client.sent.map(\.method) == [.patch, .delete])
        #expect(try DataFixtures.body(client.sent.first)["status"] as? String == "COMPLETED")
    }

    @Test func httpErrorsBecomeDomainErrorsWithBackendMessage() async {
        let client = StubHTTPClient { _ throws(HTTPError) in throw .status(code: 404, message: "Task not found") }

        await #expect(throws: DomainError.notFound("Task not found")) {
            try await APITaskRepository(client: client).delete(id: TaskID("missing"))
        }
    }
}
