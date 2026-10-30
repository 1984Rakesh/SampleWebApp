import AuthFeature
import DashboardFeature
import SwiftUI
import TasksFeature
import UIKit

/// The signed-in shell: one tab per feature flow (ios §6.4). It links features; each tab navigates itself.
final class MainCoordinator: DashboardExternalRouting {
    enum Tab: Int {
        case dashboard
        case tasks
        case account
    }

    let tabBarController = UITabBarController()
    private let tasksFlow: any TasksFlow
    private var dashboardFlow: (any DashboardFlow)?

    init(
        account: Account,
        tasksFlow: any TasksFlow,
        makeDashboardFlow: (String, any DashboardExternalRouting) -> any DashboardFlow,
        onLogout: @escaping () -> Void
    ) {
        self.tasksFlow = tasksFlow
        let displayName = account.name.isEmpty ? account.email : account.name

        let dashboardFlow = makeDashboardFlow(account.name, self)
        self.dashboardFlow = dashboardFlow
        let dashboard = dashboardFlow.rootViewController
        dashboard.tabBarItem = UITabBarItem(title: "Dashboard", image: UIImage(systemName: "square.grid.2x2"), tag: Tab.dashboard.rawValue)

        let tasks = tasksFlow.rootViewController
        tasks.tabBarItem = UITabBarItem(title: "Tasks", image: UIImage(systemName: "checklist"), tag: Tab.tasks.rawValue)

        let accountScreen = UIHostingController(rootView: AccountPlaceholderScreen(name: displayName, onLogout: onLogout))
        accountScreen.title = "Account"
        let accountTab = UINavigationController(rootViewController: accountScreen)
        accountTab.tabBarItem = UITabBarItem(title: "Account", image: UIImage(systemName: "person.crop.circle"), tag: Tab.account.rawValue)

        tabBarController.viewControllers = [dashboard, tasks, accountTab]
    }

    // MARK: DashboardExternalRouting

    func openTasks(_ filter: DashboardTaskFilter) {
        tabBarController.selectedIndex = Tab.tasks.rawValue
        tasksFlow.handle(TasksRouteBridge.route(for: filter))
    }
}
