/// Domain failures shared by every feature (shared §4, ios §3.2).
///
/// `unavailable` (offline, timeout, 5xx) and `cancelled` are iOS additions.
public enum DomainError: Error, Equatable, Sendable {
    case validation(String)
    case unauthorized(String)
    case notFound(String)
    case conflict(String)
    case unavailable(String)
    case cancelled

    /// The user-facing message, or `nil` for a cancellation, which is never shown.
    public var message: String? {
        switch self {
        case .validation(let message), .unauthorized(let message), .notFound(let message),
             .conflict(let message), .unavailable(let message):
            message
        case .cancelled:
            nil
        }
    }
}
