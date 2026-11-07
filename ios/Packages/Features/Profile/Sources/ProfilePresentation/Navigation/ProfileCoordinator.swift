import ProfileDomain
import SwiftUI
import UIKit

/// Profile's inbound entry: App installs `rootViewController` in a tab.
public protocol ProfileFlow: AnyObject {
    var rootViewController: UIViewController { get }
}

/// Moves between Profile's own screens; App never sees these routes.
protocol ProfileInternalRouting: AnyObject {
    func showEdit(_ profile: Profile, onSaved: @escaping () -> Void)
    func closeEdit()
}

package final class ProfileCoordinator: ProfileFlow, ProfileInternalRouting {
    private let navigationController = UINavigationController()

    package var rootViewController: UIViewController {
        navigationController
    }

    package init() {
        navigationController.navigationBar.prefersLargeTitles = true
        let profile = UIHostingController(rootView: ProfileContainerView(viewModel: ProfileViewModel(router: self)))
        profile.title = "Profile"
        navigationController.setViewControllers([profile], animated: false)
    }

    func showEdit(_ profile: Profile, onSaved: @escaping () -> Void) {
        let viewModel = EditProfileViewModel(profile: profile, router: self, onSaved: onSaved)
        let edit = UIHostingController(rootView: EditProfileContainerView(viewModel: viewModel))
        edit.title = "Edit profile"
        edit.navigationItem.leftBarButtonItem = UIBarButtonItem(
            systemItem: .cancel,
            primaryAction: UIAction { _ in viewModel.send(.cancel) }
        )
        let sheet = UINavigationController(rootViewController: edit)
        sheet.modalPresentationStyle = .pageSheet
        sheet.sheetPresentationController?.detents = [.large()]
        sheet.sheetPresentationController?.prefersGrabberVisible = true
        navigationController.present(sheet, animated: true)
    }

    func closeEdit() {
        navigationController.presentedViewController?.dismiss(animated: true)
    }
}
