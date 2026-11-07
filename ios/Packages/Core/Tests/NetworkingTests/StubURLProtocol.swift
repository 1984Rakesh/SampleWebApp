import Foundation
import os

/// Serves canned responses keyed by host, so parallel tests each use their own host and never share stubs.
final class StubURLProtocol: URLProtocol {
    struct Stub: Sendable {
        var status: Int = 200
        var body: Data = Data()
        var error: URLError?
    }

    typealias Recorder = @Sendable (URLRequest) -> Void

    private static let stubs = OSAllocatedUnfairLock<[String: (Stub, Recorder?)]>(initialState: [:])

    /// A session whose requests to `host` are answered with `stub`; `record` sees each request.
    static func session(host: String, stub: Stub, record: Recorder? = nil) -> URLSession {
        stubs.withLock { $0[host] = (stub, record) }
        let configuration = URLSessionConfiguration.ephemeral
        configuration.protocolClasses = [StubURLProtocol.self]
        return URLSession(configuration: configuration)
    }

    override class func canInit(with request: URLRequest) -> Bool {
        true
    }

    override class func canonicalRequest(for request: URLRequest) -> URLRequest {
        request
    }

    override func startLoading() {
        let host = request.url?.host() ?? ""
        guard let (stub, record) = Self.stubs.withLock({ $0[host] }) else {
            client?.urlProtocol(self, didFailWithError: URLError(.unsupportedURL))
            return
        }
        record?(Self.withBody(request))
        if let error = stub.error {
            client?.urlProtocol(self, didFailWithError: error)
            return
        }
        let response = HTTPURLResponse(url: request.url!, statusCode: stub.status, httpVersion: nil, headerFields: nil)!
        client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
        client?.urlProtocol(self, didLoad: stub.body)
        client?.urlProtocolDidFinishLoading(self)
    }

    override func stopLoading() {}

    /// URLSession moves bodies into a stream; copy it back so tests can assert on it.
    private static func withBody(_ request: URLRequest) -> URLRequest {
        guard request.httpBody == nil, let stream = request.httpBodyStream else { return request }
        var copy = request
        stream.open()
        defer { stream.close() }
        var data = Data()
        var buffer = [UInt8](repeating: 0, count: 1024)
        while stream.hasBytesAvailable {
            let count = stream.read(&buffer, maxLength: buffer.count)
            guard count > 0 else { break }
            data.append(buffer, count: count)
        }
        copy.httpBody = data
        return copy
    }
}
