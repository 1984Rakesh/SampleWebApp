import SharedDomain

/// The signed-in user's profile. Profile owns this model even though Auth also knows the user (shared §2).
public struct Profile: Equatable, Sendable {
    public let id: String
    public var name: String
    public let email: String
    /// An image URL as stored by the server; shown only when it is a valid http(s) URL.
    public var avatar: String?
    public var bio: String?
    public let createdAt: Timestamp

    public init(id: String, name: String, email: String, avatar: String?, bio: String?, createdAt: Timestamp) {
        self.id = id
        self.name = name
        self.email = email
        self.avatar = avatar
        self.bio = bio
        self.createdAt = createdAt
    }
}

/// A trimmed, non-empty display name (mirrors the server's `normalizeUserName`).
public struct ProfileName: Equatable, Sendable {
    public let value: String

    public init(_ raw: String) throws(DomainError) {
        let normalized = raw.trimmedWhitespace
        guard !normalized.isEmpty else { throw .validation("Name cannot be empty") }
        value = normalized
    }
}

/// Changes to the profile. `nil` keeps the name; `Patch` covers the nullable fields (shared §2).
public struct ProfileChanges: Equatable, Sendable {
    public var name: ProfileName?
    public var bio: Patch<String>
    public var avatar: Patch<String>

    public init(name: ProfileName? = nil, bio: Patch<String> = .keep, avatar: Patch<String> = .keep) {
        self.name = name
        self.bio = bio
        self.avatar = avatar
    }

    public var isEmpty: Bool {
        self == ProfileChanges()
    }
}

public protocol ProfileRepository: Sendable {
    func currentProfile() async throws(DomainError) -> Profile
    func update(_ changes: ProfileChanges) async throws(DomainError) -> Profile
}

/// Ends the signed-in session. Consumer-owned; App backs it with the Auth feature.
public protocol SessionEnding: Sendable {
    func endSession() async
}
