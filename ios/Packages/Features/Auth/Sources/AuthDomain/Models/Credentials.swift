import SharedDomain

/// A trimmed, lowercased, well-formed email address (mirrors the server's `normalizeEmail`).
public struct EmailAddress: Equatable, Sendable {
    public let value: String

    public init(_ raw: String) throws(DomainError) {
        let normalized = raw.trimmedWhitespace.lowercased()
        guard !normalized.isEmpty else { throw .validation("Email is required") }
        guard Self.isWellFormed(normalized) else { throw .validation("Invalid email format") }
        value = normalized
    }

    /// Same rule as the server's `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`: one `@`, no whitespace,
    /// and a dot in the domain with text on both sides.
    private static func isWellFormed(_ email: String) -> Bool {
        guard !email.contains(where: \.isWhitespace) else { return false }
        let parts = email.split(separator: "@", omittingEmptySubsequences: false)
        guard parts.count == 2, !parts[0].isEmpty else { return false }
        return parts[1].dropFirst().dropLast().contains(".")
    }
}

/// A password. Sign-in only requires one; a new account needs at least `minimumLength` characters.
public struct Password: Equatable, Sendable {
    public static let minimumLength = 6

    public let value: String

    private init(value: String) {
        self.value = value
    }

    public static func existing(_ raw: String) throws(DomainError) -> Password {
        guard !raw.isEmpty else { throw .validation("Password is required") }
        return Password(value: raw)
    }

    public static func new(_ raw: String) throws(DomainError) -> Password {
        guard raw.count >= minimumLength else {
            throw .validation("Password must be at least \(minimumLength) characters")
        }
        return Password(value: raw)
    }
}

/// A trimmed, non-empty display name (mirrors the server's `normalizeUserName`).
public struct PersonName: Equatable, Sendable {
    public let value: String

    public init(_ raw: String) throws(DomainError) {
        let normalized = raw.trimmedWhitespace
        guard !normalized.isEmpty else { throw .validation("Name cannot be empty") }
        value = normalized
    }
}

public struct LoginCredentials: Equatable, Sendable {
    public let email: EmailAddress
    public let password: Password

    public init(email: EmailAddress, password: Password) {
        self.email = email
        self.password = password
    }
}

public struct Registration: Equatable, Sendable {
    public let name: PersonName
    public let email: EmailAddress
    public let password: Password

    public init(name: PersonName, email: EmailAddress, password: Password) {
        self.name = name
        self.email = email
        self.password = password
    }
}
