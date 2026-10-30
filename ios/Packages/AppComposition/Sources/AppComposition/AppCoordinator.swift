import AuthFeature
import Networking
import SwiftUI
import UIKit

/// What the shell needs from the session, so tests can drive the root swap without Auth's internals.
struct SessionServices {
    let restore: any RestoreSessionUseCase
    let observe: any ObserveSessionUseCase
    let logout: any LogoutUseCase
    let makeAuthFlow: () -> any AuthFlow
}

/// Owns the window and its root (ios §6.4): splash while the session is restored, then the Auth flow
/// or the signed-in shell, swapped whenever the session changes. It never navigates inside a feature.
public final class AppCoordinator: Coordinator {
    static let keychainService = "dev.samplewebapp.TasksApp.session"

    private let window: UIWindow
    private let session: SessionServices
    private var authFlow: (any AuthFlow)?
    private var renderedState: SessionState?

    public convenience init(window: UIWindow, config: AppConfig) {
        AuthAssembly.configure(
            publicClient: URLSessionHTTPClient(baseURL: config.apiBaseURL),
            keychainService: Self.keychainService
        )
        self.init(
            window: window,
            session: SessionServices(
                restore: AuthAssembly.restoreSession(),
                observe: AuthAssembly.observeSession(),
                logout: AuthAssembly.logout(),
                makeAuthFlow: AuthAssembly.makeFlow
            )
        )
    }

    init(window: UIWindow, session: SessionServices) {
        self.window = window
        self.session = session
    }

    public func start() {
        setRoot(UIHostingController(rootView: SplashScreen()), animated: false)
        window.makeKeyAndVisible()
        Task { [weak self, session] in
            _ = await session.restore.execute()
            for await state in await session.observe.execute() {
                guard let self else { return }
                self.render(state)
            }
        }
    }

    func render(_ state: SessionState) {
        guard state != renderedState else { return }
        renderedState = state
        switch state {
        case .signedOut:
            let flow = session.makeAuthFlow()
            authFlow = flow
            setRoot(flow.rootViewController, animated: true)
        case .signedIn(let account):
            authFlow = nil
            let logout = session.logout
            let home = SignedInPlaceholderScreen(name: account.name.isEmpty ? account.email : account.name) {
                Task { await logout.execute() }
            }
            setRoot(UIHostingController(rootView: home), animated: true)
        }
    }

    /// Swaps the window's root with a cross-dissolve.
    func setRoot(_ viewController: UIViewController, animated: Bool) {
        window.rootViewController = viewController
        guard animated else { return }
        UIView.transition(with: window, duration: 0.25, options: .transitionCrossDissolve, animations: nil)
    }
}
