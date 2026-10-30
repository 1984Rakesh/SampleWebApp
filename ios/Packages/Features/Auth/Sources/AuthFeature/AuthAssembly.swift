@_exported import AuthDomain
@_exported import AuthPresentation
import AuthData
import Factory
import Networking
import SecureStorage

/// Auth's only public entry point (shared §10). Builds Auth's internals; App passes in only the transport
/// and the Keychain service name.
public enum AuthAssembly {
    /// Creates the session and registers Auth's implementations. Call once at launch, before anything else.
    ///
    /// `publicClient` must be unauthenticated; Auth uses it for sign-in and token refresh.
    public static func configure(publicClient: any HTTPClient, keychainService: String) {
        let store = KeychainTokenStore(keychain: KeychainStore(service: keychainService))
        let repository = APISessionRepository(client: publicClient, store: store)
        let authenticatedClient = AuthenticatedHTTPClient(inner: publicClient, tokens: repository)
        let container = AuthContainer.shared
        container.sessionRepository.register { repository }
        container.authenticatedClient.register { authenticatedClient }
    }

    /// The login/sign-up stack shown while signed out.
    public static func makeFlow() -> any AuthFlow {
        AuthCoordinator()
    }

    /// Adds the bearer token and refreshes it. Other features receive it as a plain `HTTPClient` (ios §4.4).
    public static func authenticatedClient() -> any HTTPClient {
        AuthContainer.shared.authenticatedClient()
    }

    public static func restoreSession() -> any RestoreSessionUseCase {
        AuthContainer.shared.restoreSession()
    }

    public static func observeSession() -> any ObserveSessionUseCase {
        AuthContainer.shared.observeSession()
    }

    public static func logout() -> any LogoutUseCase {
        AuthContainer.shared.logout()
    }
}

nonisolated extension AuthContainer {
    var authenticatedClient: Factory<any HTTPClient> {
        self { fatalError("AuthAssembly.configure must register the authenticated client") }
    }
}
