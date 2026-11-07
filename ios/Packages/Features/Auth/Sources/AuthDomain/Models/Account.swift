/// The signed-in user as the session knows them.
public struct Account: Equatable, Sendable {
    public let id: String
    public let name: String
    public let email: String

    public init(id: String, name: String, email: String) {
        self.id = id
        self.name = name
        self.email = email
    }
}

/// Whether someone is signed in. Drives the app's root (ios §6.4).
public enum SessionState: Equatable, Sendable {
    case signedOut
    case signedIn(Account)
}
