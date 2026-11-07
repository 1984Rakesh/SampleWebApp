/// An instant in time without Foundation, so domain code stays pure Swift (shared §1).
///
/// Data maps ISO-8601 strings to it; Presentation converts it to `Date` for formatting.
public struct Timestamp: Comparable, Hashable, Sendable {
    public let secondsSince1970: Double

    public init(secondsSince1970: Double) {
        self.secondsSince1970 = secondsSince1970
    }

    public static func < (lhs: Timestamp, rhs: Timestamp) -> Bool {
        lhs.secondsSince1970 < rhs.secondsSince1970
    }
}
