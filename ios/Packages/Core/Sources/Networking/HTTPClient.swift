import Foundation

public struct HTTPResponse: Equatable, Sendable {
    public let status: Int
    public let data: Data

    public init(status: Int, data: Data) {
        self.status = status
        self.data = data
    }

    /// Decodes the body with `JSONCoding`.
    public func decode<Value: Decodable>(_ type: Value.Type) throws(HTTPError) -> Value {
        do {
            return try JSONCoding.decoder().decode(type, from: data)
        } catch {
            throw .invalidResponse("Unexpected server response")
        }
    }
}

public protocol HTTPClient: Sendable {
    func send(_ endpoint: Endpoint) async throws(HTTPError) -> HTTPResponse
}
