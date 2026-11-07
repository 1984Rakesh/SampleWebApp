extension StringProtocol {
    /// The text without leading or trailing whitespace and newlines, using only the standard library.
    public var trimmedWhitespace: String {
        guard let first = firstIndex(where: { !$0.isWhitespace }),
              let last = lastIndex(where: { !$0.isWhitespace })
        else { return "" }
        return String(self[first...last])
    }
}
