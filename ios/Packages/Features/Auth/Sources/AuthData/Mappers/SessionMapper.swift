import AuthDomain
import SharedDomain

/// Normalizes then validates transport and stored values before building domain values (shared §2).
enum SessionMapper {
    static let unexpectedResponse = DomainError.unavailable("Unexpected server response")

    static func storedSession(from response: AuthResponseDTO) throws(DomainError) -> StoredSession {
        guard let user = response.user,
              let accessToken = nonEmpty(response.accessToken),
              let refreshToken = nonEmpty(response.refreshToken),
              let account = storedAccount(id: user.id, name: user.name, email: user.email)
        else { throw unexpectedResponse }
        return StoredSession(accessToken: accessToken, refreshToken: refreshToken, account: account)
    }

    static func accessToken(from response: RefreshResponseDTO) -> String? {
        nonEmpty(response.accessToken)
    }

    /// `nil` when a stored session is incomplete, so the caller clears it instead of reviving it.
    static func account(from stored: StoredSession) -> Account? {
        guard nonEmpty(stored.accessToken) != nil, nonEmpty(stored.refreshToken) != nil,
              let account = storedAccount(id: stored.account.id, name: stored.account.name, email: stored.account.email)
        else { return nil }
        return Account(id: account.id, name: account.name, email: account.email)
    }

    private static func storedAccount(id: String?, name: String?, email: String?) -> StoredSession.StoredAccount? {
        guard let id = nonEmpty(id), let email = nonEmpty(email) else { return nil }
        return StoredSession.StoredAccount(id: id, name: name?.trimmedWhitespace ?? "", email: email)
    }

    private static func nonEmpty(_ text: String?) -> String? {
        guard let trimmed = text?.trimmedWhitespace, !trimmed.isEmpty else { return nil }
        return trimmed
    }
}
