import SwiftUI
import UIKit

/// Which tasks a dashboard card asks to see, in Dashboard's own vocabulary; App maps it to Tasks' route.
public enum DashboardTaskFilter: Equatable, Sendable {
    case all
    case todo
    case inProgress
    case completed
    case overdue
}

/// What Dashboard needs from outside: showing tasks (shared §9).
public protocol DashboardExternalRouting: AnyObject {
    func openTasks(_ filter: DashboardTaskFilter)
}

/// Dashboard's inbound entry: App installs `rootViewController` in a tab.
public protocol DashboardFlow: AnyObject {
    var rootViewController: UIViewController { get }
}

package final class DashboardCoordinator: DashboardFlow {
    private let navigationController = UINavigationController()

    package var rootViewController: UIViewController {
        navigationController
    }

    package init(displayName: String, router: any DashboardExternalRouting) {
        navigationController.navigationBar.prefersLargeTitles = true
        let viewModel = DashboardViewModel(displayName: displayName, router: router)
        let dashboard = UIHostingController(rootView: DashboardContainerView(viewModel: viewModel))
        dashboard.title = "Dashboard"
        navigationController.setViewControllers([dashboard], animated: false)
    }
}
