import SwiftUI
import UIKit

/// Auth's inbound entry: the navigation stack App installs as the root while signed out (shared §9).
public protocol AuthFlow: AnyObject {
    var rootViewController: UIViewController { get }
}

/// Moves between Auth's own screens; App never sees these routes.
protocol AuthInternalRouting: AnyObject {
    func showSignup()
    func showLogin()
}

package final class AuthCoordinator: AuthFlow, AuthInternalRouting {
    private let navigationController = UINavigationController()
    /// Off in tests, where there is no window for transitions to finish in.
    private let animated: Bool

    package var rootViewController: UIViewController {
        navigationController
    }

    package init(animated: Bool = true) {
        self.animated = animated
        navigationController.navigationBar.prefersLargeTitles = false
        navigationController.setViewControllers([makeLogin()], animated: false)
    }

    func showSignup() {
        navigationController.pushViewController(makeSignup(), animated: animated)
    }

    func showLogin() {
        navigationController.popToRootViewController(animated: animated)
    }

    private func makeLogin() -> UIViewController {
        let viewController = UIHostingController(rootView: LoginContainer(viewModel: LoginViewModel(router: self)))
        viewController.navigationItem.backButtonDisplayMode = .minimal
        return viewController
    }

    private func makeSignup() -> UIViewController {
        let viewController = UIHostingController(rootView: SignupContainer(viewModel: SignupViewModel(router: self)))
        viewController.title = "Create account"
        return viewController
    }
}
