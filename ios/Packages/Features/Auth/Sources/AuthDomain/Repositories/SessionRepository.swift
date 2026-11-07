import SharedDomain

/// Owns the signed-in session: sign-in, sign-up, restore at launch, sign-out and change notifications.
public protocol SessionRepository: Sendable {
    /// Loads a stored session, clearing it if it is corrupt.
    func restore() async -> SessionState
    func login(_ credentials: LoginCredentials) async throws(DomainError) -> Account
    func register(_ registration: Registration) async throws(DomainError) -> Account
    func logout() async
    /// Emits the current state immediately, then every change, until the consumer stops iterating.
    func sessionChanges() async -> AsyncStream<SessionState>
}
