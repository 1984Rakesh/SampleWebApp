import SharedDomain

/// A transport-level failure. Data repositories translate it with `domainError` (shared §4).
public enum HTTPError: Error, Equatable, Sendable {
    /// A non-2xx response; `message` comes from the backend's `{ error }` body when present.
    case status(code: Int, message: String)
    case transport(String)
    case invalidRequest(String)
    case invalidResponse(String)
    case cancelled

    /// The domain failure for this error, keeping the backend message (shared §5 status mapping).
    public var domainError: DomainError {
        switch self {
        case .status(code: 400, let message): .validation(message)
        case .status(code: 401, let message), .status(code: 403, let message): .unauthorized(message)
        case .status(code: 404, let message): .notFound(message)
        case .status(code: 409, let message): .conflict(message)
        case .status(let code, let message) where code >= 500: .unavailable(message)
        case .status(_, let message): .validation(message)
        case .transport(let message), .invalidResponse(let message): .unavailable(message)
        case .invalidRequest(let message): .validation(message)
        case .cancelled: .cancelled
        }
    }
}
