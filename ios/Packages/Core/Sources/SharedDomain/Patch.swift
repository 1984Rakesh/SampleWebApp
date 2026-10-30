/// A tri-state change for a nullable field (shared §2): keep it, clear it, or set a new value.
public enum Patch<Value: Sendable>: Sendable {
    case keep
    case clear
    case set(Value)

    /// The field's value after applying this patch to `current`.
    public func applied(to current: Value?) -> Value? {
        switch self {
        case .keep: current
        case .clear: nil
        case .set(let value): value
        }
    }
}

extension Patch: Equatable where Value: Equatable {}
