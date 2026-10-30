import SharedDomain

public protocol GetProfileUseCase: Sendable {
    func execute() async throws(DomainError) -> Profile
}

package struct DefaultGetProfileUseCase: GetProfileUseCase {
    let repository: any ProfileRepository

    package init(repository: any ProfileRepository) {
        self.repository = repository
    }

    package func execute() async throws(DomainError) -> Profile {
        try await repository.currentProfile()
    }
}

public protocol UpdateProfileUseCase: Sendable {
    /// Applies `changes`; with nothing to change it returns `original` without a request.
    func execute(_ original: Profile, changes: ProfileChanges) async throws(DomainError) -> Profile
}

package struct DefaultUpdateProfileUseCase: UpdateProfileUseCase {
    let repository: any ProfileRepository

    package init(repository: any ProfileRepository) {
        self.repository = repository
    }

    package func execute(_ original: Profile, changes: ProfileChanges) async throws(DomainError) -> Profile {
        var normalized = changes
        normalized.bio = Self.normalize(changes.bio)
        normalized.avatar = Self.normalize(changes.avatar)
        guard !normalized.isEmpty else { return original }
        return try await repository.update(normalized)
    }

    /// Blank text clears the field, like the server's `normalizeOptionalText`.
    private static func normalize(_ patch: Patch<String>) -> Patch<String> {
        guard case .set(let text) = patch else { return patch }
        let trimmed = text.trimmedWhitespace
        return trimmed.isEmpty ? .clear : .set(trimmed)
    }
}

public protocol SignOutUseCase: Sendable {
    func execute() async
}

package struct DefaultSignOutUseCase: SignOutUseCase {
    let session: any SessionEnding

    package init(session: any SessionEnding) {
        self.session = session
    }

    package func execute() async {
        await session.endSession()
    }
}
