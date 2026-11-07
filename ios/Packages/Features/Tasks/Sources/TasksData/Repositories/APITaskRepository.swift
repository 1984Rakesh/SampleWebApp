import Foundation
import Networking
import SharedDomain
import TasksDomain

/// `TaskRepository` over the tasks API. `client` is the authenticated client App passes in (ios §4.4).
package struct APITaskRepository: TaskRepository {
    private let client: any HTTPClient

    package init(client: any HTTPClient) {
        self.client = client
    }

    package func tasks(filter: TaskFilter) async throws(DomainError) -> [TaskItem] {
        var query: [URLQueryItem] = []
        if let status = filter.status {
            query.append(URLQueryItem(name: "status", value: TaskMapper.raw(status)))
        }
        if let priority = filter.priority {
            query.append(URLQueryItem(name: "priority", value: TaskMapper.raw(priority)))
        }
        let dtos = try await perform(Endpoint(method: .get, path: "/tasks", query: query), decoding: [TaskResponseDTO].self)
        var tasks: [TaskItem] = []
        for dto in dtos {
            tasks.append(try TaskMapper.task(from: dto))
        }
        return tasks
    }

    package func create(_ task: NewTask) async throws(DomainError) -> TaskItem {
        let endpoint = try json(.post, "/tasks", body: TaskMapper.createRequest(from: task))
        return try TaskMapper.task(from: try await perform(endpoint, decoding: TaskResponseDTO.self))
    }

    package func update(id: TaskID, changes: TaskChanges) async throws(DomainError) -> TaskItem {
        let endpoint = try json(.put, "/tasks/\(id.value)", body: TaskMapper.updateRequest(from: changes))
        return try TaskMapper.task(from: try await perform(endpoint, decoding: TaskResponseDTO.self))
    }

    package func setStatus(id: TaskID, _ status: TaskStatus) async throws(DomainError) -> TaskItem {
        let body = UpdateTaskStatusRequestDTO(status: TaskMapper.raw(status))
        let endpoint = try json(.patch, "/tasks/\(id.value)/status", body: body)
        return try TaskMapper.task(from: try await perform(endpoint, decoding: TaskResponseDTO.self))
    }

    package func delete(id: TaskID) async throws(DomainError) {
        do {
            _ = try await client.send(Endpoint(method: .delete, path: "/tasks/\(id.value)"))
        } catch {
            throw error.domainError
        }
    }

    // Raw HTTP errors appear here, so they are translated here (shared §4).
    private func perform<Value: Decodable>(_ endpoint: Endpoint, decoding type: Value.Type) async throws(DomainError) -> Value {
        do {
            return try await client.send(endpoint).decode(type)
        } catch {
            throw error.domainError
        }
    }

    private func json(_ method: HTTPMethod, _ path: String, body: some Encodable) throws(DomainError) -> Endpoint {
        do {
            return try Endpoint.json(method, path, body: body)
        } catch {
            throw error.domainError
        }
    }
}
