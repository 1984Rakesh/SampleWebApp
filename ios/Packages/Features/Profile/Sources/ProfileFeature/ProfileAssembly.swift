@_exported import ProfileDomain
@_exported import ProfilePresentation
import Factory
import Networking
import ProfileData

/// Profile's only public entry point (shared §10). App passes in the authenticated transport and
/// how to end the session.
public enum ProfileAssembly {
    /// Registers Profile's implementations. Call once at launch, after Auth is configured.
    public static func configure(client: any HTTPClient, sessionEnding: any SessionEnding) {
        let container = ProfileContainer.shared
        container.profileRepository.register { APIProfileRepository(client: client) }
        container.sessionEnding.register { sessionEnding }
    }

    /// A fresh Profile stack for a signed-in user.
    public static func makeFlow() -> any ProfileFlow {
        ProfileCoordinator()
    }

    /// Drops user-scoped registrations on sign-out (ios §7.4).
    public static func resetSession() {
        ProfileContainer.shared.manager.reset(scope: ProfileContainer.sessionScope)
    }
}
