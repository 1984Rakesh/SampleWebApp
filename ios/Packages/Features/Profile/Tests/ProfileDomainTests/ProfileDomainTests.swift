import Testing
import SharedDomain
@testable import ProfileDomain

nonisolated let sampleProfile = Profile(
    id: "u1", name: "Ada", email: "ada@example.com", avatar: nil, bio: "Old bio",
    createdAt: Timestamp(secondsSince1970: 0)
)

@Suite struct ProfileDomainTests {
    @Test func nameIsTrimmedAndRequired() throws {
        #expect(try ProfileName("  Ada L ").value == "Ada L")
        #expect(throws: DomainError.validation("Name cannot be empty")) { try ProfileName("\n ") }
    }

    @Test func updateWithoutChangesSkipsRepository() async throws {
        let repository = RecordingProfileRepository()

        #expect(try await DefaultUpdateProfileUseCase(repository: repository).execute(sampleProfile, changes: ProfileChanges()) == sampleProfile)
        #expect(await repository.updates.isEmpty)
    }

    @Test func blankBioAndAvatarClear() async throws {
        let repository = RecordingProfileRepository()

        _ = try await DefaultUpdateProfileUseCase(repository: repository)
            .execute(sampleProfile, changes: ProfileChanges(bio: .set("  "), avatar: .set(" https://x.test/a.png ")))

        #expect(await repository.updates == [ProfileChanges(bio: .clear, avatar: .set("https://x.test/a.png"))])
    }

    @Test func signOutEndsSession() async {
        let session = RecordingSession()

        await DefaultSignOutUseCase(session: session).execute()

        #expect(await session.ended == 1)
    }
}

actor RecordingProfileRepository: ProfileRepository {
    private(set) var updates: [ProfileChanges] = []

    func currentProfile() async throws(DomainError) -> Profile { sampleProfile }

    func update(_ changes: ProfileChanges) async throws(DomainError) -> Profile {
        updates.append(changes)
        return sampleProfile
    }
}

actor RecordingSession: SessionEnding {
    private(set) var ended = 0
    func endSession() async { ended += 1 }
}
