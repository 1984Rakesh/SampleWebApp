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

    package var rootViewController: UIViewController {
        navigationController
    }

    package init() {
        navigationController.navigationBar.prefersLargeTitles = false
        navigationController.setViewControllers([makeLogin()], animated: false)
    }

    func showSignup() {
        navigationController.pushViewController(makeSignup(), animated: true)
    }

    func showLogin() {
        navigationController.popToRootViewController(animated: true)
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
