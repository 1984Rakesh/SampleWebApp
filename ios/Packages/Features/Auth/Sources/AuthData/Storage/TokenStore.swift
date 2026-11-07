import Foundation
import SharedDomain
import SecureStorage

/// Persists the session between launches.
package protocol TokenStore: Sendable {
    /// The stored session, or `nil` when there is none or it cannot be read.
    func load() -> StoredSession?
    func save(_ session: StoredSession) throws(DomainError)
    func clear()
}

/// `TokenStore` in the Keychain, as one JSON item. Unreadable items are removed.
package struct KeychainTokenStore: TokenStore {
    static let key = "session"

    private let keychain: KeychainStore

    package init(keychain: KeychainStore) {
        self.keychain = keychain
    }

    package func load() -> StoredSession? {
        guard let data = try? keychain.data(for: Self.key) else { return nil }
        guard let session = try? JSONDecoder().decode(StoredSession.self, from: data) else {
            clear()
            return nil
        }
        return session
    }

    package func save(_ session: StoredSession) throws(DomainError) {
        do {
            let data = try JSONEncoder().encode(session)
            try keychain.set(data, for: Self.key)
        } catch {
            throw .unavailable("Could not save your session on this device")
        }
    }

    package func clear() {
        try? keychain.removeValue(for: Self.key)
    }
}
