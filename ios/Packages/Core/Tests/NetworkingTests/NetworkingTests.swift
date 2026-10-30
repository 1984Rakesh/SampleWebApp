import Foundation
import Testing
import os
import SharedDomain
@testable import Networking

@Suite struct URLSessionHTTPClientTests {
    private struct Payload: Codable, Equatable {
        let title: String
        let dueDate: Date
    }

    private func client(stub: StubURLProtocol.Stub, record: StubURLProtocol.Recorder? = nil) -> URLSessionHTTPClient {
        let host = "test-\(UUID().uuidString.lowercased()).example"
        let session = StubURLProtocol.session(host: host, stub: stub, record: record)
        return URLSessionHTTPClient(baseURL: URL(string: "https://\(host)/api")!, session: session)
    }

    @Test func sendsJSONRequestToPathUnderBaseURL() async throws {
        let seen = OSAllocatedUnfairLock<URLRequest?>(initialState: nil)
        let sut = client(stub: .init(status: 201, body: Data("{}".utf8))) { request in seen.withLock { $0 = request } }
        let date = try #require(JSONCoding.parseDate("2026-10-30T12:00:00.000Z"))

        let endpoint = try Endpoint.json(.post, "/tasks", body: Payload(title: "Write", dueDate: date))
        let response = try await sut.send(endpoint)

        let request = try #require(seen.withLock { $0 })
        #expect(response.status == 201)
        #expect(request.httpMethod == "POST")
        #expect(request.url?.path() == "/api/tasks")
        #expect(request.value(forHTTPHeaderField: "Content-Type") == "application/json")
        let body = try #require(request.httpBody)
        let json = try #require(String(data: body, encoding: .utf8))
        #expect(json.contains(#""dueDate":"2026-10-30T12:00:00.000Z""#))
    }

    @Test func appendsQueryItems() async throws {
        let seen = OSAllocatedUnfairLock<URLRequest?>(initialState: nil)
        let sut = client(stub: .init(body: Data("[]".utf8))) { request in seen.withLock { $0 = request } }

        _ = try await sut.send(Endpoint(method: .get, path: "/tasks", query: [URLQueryItem(name: "status", value: "TODO")]))

        #expect(seen.withLock { $0 }?.url?.query() == "status=TODO")
    }

    @Test func decodesBodyWithISODates() async throws {
        let sut = client(stub: .init(body: Data(#"{"title":"Write","dueDate":"2026-10-30T12:00:00Z"}"#.utf8)))

        let payload = try await sut.send(Endpoint(method: .get, path: "/tasks/1")).decode(Payload.self)

        #expect(payload.title == "Write")
        #expect(JSONCoding.formatDate(payload.dueDate) == "2026-10-30T12:00:00.000Z")
    }

    @Test func nonSuccessStatusKeepsBackendMessage() async {
        let sut = client(stub: .init(status: 409, body: Data(#"{"error":"Email already registered"}"#.utf8)))

        await #expect(throws: HTTPError.status(code: 409, message: "Email already registered")) {
            try await sut.send(Endpoint(method: .post, path: "/auth/register"))
        }
    }

    @Test func nonSuccessStatusWithoutBodyUsesStatusText() async {
        let sut = client(stub: .init(status: 500))

        await #expect(throws: HTTPError.status(code: 500, message: HTTPURLResponse.localizedString(forStatusCode: 500))) {
            try await sut.send(Endpoint(method: .get, path: "/tasks"))
        }
    }

    @Test func offlineBecomesTransportError() async {
        let sut = client(stub: .init(error: URLError(.notConnectedToInternet)))

        await #expect {
            try await sut.send(Endpoint(method: .get, path: "/tasks"))
        } throws: { error in
            guard case .transport = error as? HTTPError else { return false }
            return true
        }
    }

    @Test func cancelledRequestBecomesCancelled() async {
        let sut = client(stub: .init(error: URLError(.cancelled)))

        await #expect(throws: HTTPError.cancelled) {
            try await sut.send(Endpoint(method: .get, path: "/tasks"))
        }
    }

    @Test func malformedBodyBecomesInvalidResponse() async throws {
        let sut = client(stub: .init(body: Data("not json".utf8)))
        let response = try await sut.send(Endpoint(method: .get, path: "/tasks/1"))

        #expect(throws: HTTPError.invalidResponse("Unexpected server response")) {
            try response.decode(Payload.self)
        }
    }
}

@Suite struct HTTPErrorTranslationTests {
    @Test(arguments: [
        (HTTPError.status(code: 400, message: "m"), DomainError.validation("m")),
        (.status(code: 401, message: "m"), .unauthorized("m")),
        (.status(code: 403, message: "m"), .unauthorized("m")),
        (.status(code: 404, message: "m"), .notFound("m")),
        (.status(code: 409, message: "m"), .conflict("m")),
        (.status(code: 422, message: "m"), .validation("m")),
        (.status(code: 500, message: "m"), .unavailable("m")),
        (.status(code: 503, message: "m"), .unavailable("m")),
        (.transport("m"), .unavailable("m")),
        (.invalidResponse("m"), .unavailable("m")),
        (.invalidRequest("m"), .validation("m")),
        (.cancelled, .cancelled),
    ])
    func mapsToDomainError(http: HTTPError, domain: DomainError) {
        #expect(http.domainError == domain)
    }
}
