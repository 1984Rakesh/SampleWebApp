import AuthFeature
import DashboardFeature
import ProfileFeature
import TasksFeature
import UIKit

/// The signed-in shell: one tab per feature flow (ios §6.4). It links features; each tab navigates itself.
final class MainCoordinator: DashboardExternalRouting {
    enum Tab: Int {
        case dashboard
        case tasks
        case profile
    }

    let tabBarController = UITabBarController()
    private let tasksFlow: any TasksFlow
    private let profileFlow: any ProfileFlow
    private var dashboardFlow: (any DashboardFlow)?

    init(
        account: Account,
        tasksFlow: any TasksFlow,
        profileFlow: any ProfileFlow,
        makeDashboardFlow: (String, any DashboardExternalRouting) -> any DashboardFlow
    ) {
        self.tasksFlow = tasksFlow
        self.profileFlow = profileFlow

        let dashboardFlow = makeDashboardFlow(account.name, self)
        self.dashboardFlow = dashboardFlow
        let dashboard = dashboardFlow.rootViewController
        dashboard.tabBarItem = UITabBarItem(title: "Dashboard", image: UIImage(systemName: "square.grid.2x2"), tag: Tab.dashboard.rawValue)

        let tasks = tasksFlow.rootViewController
        tasks.tabBarItem = UITabBarItem(title: "Tasks", image: UIImage(systemName: "checklist"), tag: Tab.tasks.rawValue)

        let profile = profileFlow.rootViewController
        profile.tabBarItem = UITabBarItem(title: "Profile", image: UIImage(systemName: "person.crop.circle"), tag: Tab.profile.rawValue)

        tabBarController.viewControllers = [dashboard, tasks, profile]
    }

    // MARK: DashboardExternalRouting

    func openTasks(_ filter: DashboardTaskFilter) {
        tabBarController.selectedIndex = Tab.tasks.rawValue
        tasksFlow.handle(TasksRouteBridge.route(for: filter))
    }
}
