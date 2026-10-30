import Foundation

/// `HTTPClient` over `URLSession`. Sends and receives JSON; non-2xx responses become `HTTPError.status`
/// with the backend's `{ error }` message.
public struct URLSessionHTTPClient: HTTPClient {
    private let baseURL: URL
    private let session: URLSession

    public init(baseURL: URL, session: URLSession = .shared) {
        self.baseURL = baseURL
        self.session = session
    }

    public func send(_ endpoint: Endpoint) async throws(HTTPError) -> HTTPResponse {
        let request = try makeRequest(endpoint)
        let data: Data
        let response: URLResponse
        do {
            (data, response) = try await session.data(for: request)
        } catch {
            throw Self.translate(error)
        }
        guard let http = response as? HTTPURLResponse else {
            throw .invalidResponse("Missing HTTP response")
        }
        guard (200..<300).contains(http.statusCode) else {
            let message = Self.errorMessage(in: data)
                ?? HTTPURLResponse.localizedString(forStatusCode: http.statusCode)
            throw .status(code: http.statusCode, message: message)
        }
        return HTTPResponse(status: http.statusCode, data: data)
    }

    private func makeRequest(_ endpoint: Endpoint) throws(HTTPError) -> URLRequest {
        let url = baseURL.appending(path: endpoint.path)
        guard var components = URLComponents(url: url, resolvingAgainstBaseURL: false) else {
            throw .invalidRequest("Invalid path \(endpoint.path)")
        }
        if !endpoint.query.isEmpty {
            components.queryItems = endpoint.query
        }
        guard let resolved = components.url else {
            throw .invalidRequest("Invalid path \(endpoint.path)")
        }
        var request = URLRequest(url: resolved)
        request.httpMethod = endpoint.method.rawValue
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        if let body = endpoint.body {
            request.httpBody = body
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        }
        return request
    }

    private static func translate(_ error: any Error) -> HTTPError {
        if error is CancellationError {
            return .cancelled
        }
        if let urlError = error as? URLError {
            return urlError.code == .cancelled ? .cancelled : .transport(urlError.localizedDescription)
        }
        return .transport(error.localizedDescription)
    }

    private struct ErrorBody: Decodable {
        let error: String
    }

    private static func errorMessage(in data: Data) -> String? {
        guard let body = try? JSONDecoder().decode(ErrorBody.self, from: data) else { return nil }
        let message = body.error.trimmingCharacters(in: .whitespacesAndNewlines)
        return message.isEmpty ? nil : message
    }
}
