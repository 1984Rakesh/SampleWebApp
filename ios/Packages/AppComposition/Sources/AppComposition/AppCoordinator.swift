import SwiftUI
import UIKit

/// Owns the window and its root (ios §6.4).
///
/// P0 shows the splash only. Session restore and the Auth/Main root swap arrive with the auth feature.
public final class AppCoordinator: Coordinator {
    private let window: UIWindow
    private let config: AppConfig

    public init(window: UIWindow, config: AppConfig) {
        self.window = window
        self.config = config
    }

    public func start() {
        setRoot(UIHostingController(rootView: SplashScreen()), animated: false)
        window.makeKeyAndVisible()
    }

    /// Swaps the window's root with a cross-dissolve.
    func setRoot(_ viewController: UIViewController, animated: Bool) {
        window.rootViewController = viewController
        guard animated else { return }
        UIView.transition(with: window, duration: 0.25, options: .transitionCrossDissolve, animations: nil)
    }
}
