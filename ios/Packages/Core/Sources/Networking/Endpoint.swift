import Foundation

public enum HTTPMethod: String, Sendable {
    case get = "GET"
    case post = "POST"
    case put = "PUT"
    case patch = "PATCH"
    case delete = "DELETE"
}

/// One API request, relative to the client's base URL.
public struct Endpoint: Equatable, Sendable {
    public var method: HTTPMethod
    public var path: String
    public var query: [URLQueryItem]
    public var headers: [String: String]
    public var body: Data?

    public init(
        method: HTTPMethod,
        path: String,
        query: [URLQueryItem] = [],
        headers: [String: String] = [:],
        body: Data? = nil
    ) {
        self.method = method
        self.path = path
        self.query = query
        self.headers = headers
        self.body = body
    }

    /// An endpoint whose body is `body` encoded with `JSONCoding`.
    public static func json(
        _ method: HTTPMethod,
        _ path: String,
        body: some Encodable
    ) throws(HTTPError) -> Endpoint {
        do {
            return Endpoint(method: method, path: path, body: try JSONCoding.encoder().encode(body))
        } catch {
            throw .invalidRequest("Could not encode request body")
        }
    }
}
