/// Async content in a ViewState (ios §5.3). Holds presentation values only, never domain types.
public enum Loadable<Value: Equatable>: Equatable {
    case idle
    case loading
    case loaded(Value)
    case failed(String)

    public var value: Value? {
        if case .loaded(let value) = self { return value }
        return nil
    }
}

/// A choice in a picker or segmented control, keeping domain enums out of screens (ios §5.1).
public struct ChoiceOption: Identifiable, Equatable, Sendable {
    public let id: String
    public let label: String

    public init(id: String, label: String) {
        self.id = id
        self.label = label
    }
}
