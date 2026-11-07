import Factory
import FactoryTesting
import Foundation
import Testing
import DesignSystem
import SharedDomain
import ProfileDomain
@testable import ProfilePresentation

extension Trait where Self == ContainerTrait<ProfileContainer> {
    /// A fresh `ProfileContainer` per test (ios §7.5).
    static var profileContainer: ContainerTrait<ProfileContainer> {
        .init(shared: ProfileContainer.$shared, container: ProfileContainer())
    }
}

nonisolated let profile = Profile(
    id: "u1", name: "Ada Lovelace", email: "ada@example.com", avatar: nil, bio: nil,
    createdAt: Timestamp(secondsSince1970: 1_790_000_000)
)

actor FakeProfileRepository: ProfileRepository {
    private var result: Result<Profile, DomainError>
    private(set) var updates: [ProfileChanges] = []

    init(_ result: Result<Profile, DomainError> = .success(profile)) {
        self.result = result
    }

    func set(_ result: Result<Profile, DomainError>) { self.result = result }
    func currentProfile() async throws(DomainError) -> Profile { try result.get() }

    func update(_ changes: ProfileChanges) async throws(DomainError) -> Profile {
        updates.append(changes)
        return try result.get()
    }
}

actor RecordingSession: SessionEnding {
    private(set) var ended = 0
    func endSession() async { ended += 1 }
}

final class SpyRouter: ProfileInternalRouting {
    private(set) var calls: [String] = []
    private(set) var onSaved: (() -> Void)?

    func showEdit(_ profile: Profile, onSaved: @escaping () -> Void) {
        calls.append("edit \(profile.id)")
        self.onSaved = onSaved
    }

    func closeEdit() { calls.append("close") }
}

private func register(_ repository: FakeProfileRepository, session: RecordingSession = RecordingSession()) {
    ProfileContainer.shared.profileRepository.register { repository }
    ProfileContainer.shared.sessionEnding.register { session }
}

@Suite(.profileContainer) struct ProfileViewModelTests {
    @Test func loadsProfileContent() async throws {
        register(FakeProfileRepository())
        let sut = ProfileViewModel(router: SpyRouter(), locale: Locale(identifier: "en_US"))

        await sut.send(.onAppear)?.value

        let content = try #require(sut.state.content.value)
        #expect(content.name == "Ada Lovelace")
        #expect(content.initials == "AL")
        #expect(content.bio == nil)
        #expect(content.memberSince.hasPrefix("Member since "))
    }

    @Test(arguments: [("Ada Lovelace", "AL"), ("ada", "A"), ("Ada  B  Carter", "AB"), ("", "")])
    func initials(name: String, expected: String) {
        #expect(ProfileViewModel.initials(for: name) == expected)
    }

    @Test func failureShowsErrorState() async {
        register(FakeProfileRepository(.failure(.unavailable("Offline"))))
        let sut = ProfileViewModel(router: SpyRouter())

        await sut.send(.onAppear)?.value

        #expect(sut.state.content == .failed("Offline"))
    }

    @Test func editOpensSheetAndReloadsAfterSave() async throws {
        let repository = FakeProfileRepository()
        register(repository)
        let router = SpyRouter()
        let sut = ProfileViewModel(router: router)
        await sut.send(.onAppear)?.value

        sut.send(.edit)
        #expect(router.calls == ["edit u1"])

        var renamed = profile
        renamed.name = "Ada L"
        await repository.set(.success(renamed))
        router.onSaved?()
        for _ in 0..<100 where sut.state.content.value?.name != "Ada L" {
            try await Task.sleep(for: .milliseconds(10))
        }
        #expect(sut.state.content.value?.name == "Ada L")
    }

    @Test func signOutNeedsConfirmation() async {
        let session = RecordingSession()
        register(FakeProfileRepository(), session: session)
        let sut = ProfileViewModel(router: SpyRouter())

        sut.send(.signOutTapped)
        #expect(sut.state.isConfirmingSignOut)
        sut.send(.cancelSignOut)
        #expect(await session.ended == 0)

        sut.send(.signOutTapped)
        await sut.send(.confirmSignOut)?.value
        #expect(await session.ended == 1)
        #expect(sut.state.isSigningOut)
    }
}

@Suite(.profileContainer) struct EditProfileViewModelTests {
    @Test func validatesNameOnSaveThenLive() {
        register(FakeProfileRepository())
        let sut = EditProfileViewModel(profile: profile, router: SpyRouter(), onSaved: {})

        sut.send(.nameChanged("  "))
        #expect(sut.state.nameError == nil)
        #expect(sut.send(.save) == nil)
        #expect(sut.state.nameError == "Name cannot be empty")
        sut.send(.nameChanged("Ada"))
        #expect(sut.state.nameError == nil)
    }

    @Test func sendsOnlyChangedFieldsThenCloses() async {
        let repository = FakeProfileRepository()
        register(repository)
        let router = SpyRouter()
        var saved = false
        let sut = EditProfileViewModel(profile: profile, router: router, onSaved: { saved = true })

        sut.send(.bioChanged("  Writes programs "))
        await sut.send(.save)?.value

        #expect(await repository.updates == [ProfileChanges(bio: .set("Writes programs"))])
        #expect(saved)
        #expect(router.calls == ["close"])
    }

    @Test func failedSaveShowsMessageAndStaysOpen() async {
        register(FakeProfileRepository(.failure(.validation("Name cannot be empty"))))
        let router = SpyRouter()
        let sut = EditProfileViewModel(profile: profile, router: router, onSaved: {})
        sut.send(.nameChanged("Ada L"))

        await sut.send(.save)?.value

        #expect(sut.state.errorMessage == "Name cannot be empty")
        #expect(router.calls.isEmpty)
    }
}
