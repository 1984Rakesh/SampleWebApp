import Factory
import ProfileDomain

/// Profile's own DI container (ios §7.1). Test traits swap `shared` per test through `@TaskLocal`.
package nonisolated final class ProfileContainer: SharedContainer {
    @TaskLocal package static var shared = ProfileContainer()
    package let manager = ContainerManager()

    /// User-scoped registrations; App resets it on sign-out through `ProfileAssembly.resetSession()` (ios §7.4).
    package static let sessionScope = Scope.Cached()

    package init() {}
}

package nonisolated extension ProfileContainer {
    /// Registered by `ProfileAssembly.configure`; resolving it earlier is a wiring bug.
    var profileRepository: Factory<any ProfileRepository> {
        self { fatalError("ProfileAssembly.configure must register the profile repository") }
            .scope(ProfileContainer.sessionScope)
    }

    /// Registered by `ProfileAssembly.configure`; resolving it earlier is a wiring bug.
    var sessionEnding: Factory<any SessionEnding> {
        self { fatalError("ProfileAssembly.configure must register session ending") }
    }

    var getProfile: Factory<any GetProfileUseCase> {
        self { DefaultGetProfileUseCase(repository: self.profileRepository()) }
    }

    var updateProfile: Factory<any UpdateProfileUseCase> {
        self { DefaultUpdateProfileUseCase(repository: self.profileRepository()) }
    }

    var signOut: Factory<any SignOutUseCase> {
        self { DefaultSignOutUseCase(session: self.sessionEnding()) }
    }
}
