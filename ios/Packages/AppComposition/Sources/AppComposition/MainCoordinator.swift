import AuthFeature
import SwiftUI
import TasksFeature
import UIKit

/// The signed-in shell: one tab per feature flow (ios §6.4). It links features; each tab navigates itself.
final class MainCoordinator {
    let tabBarController = UITabBarController()
    private let tasksFlow: any TasksFlow

    init(account: Account, tasksFlow: any TasksFlow, onLogout: @escaping () -> Void) {
        self.tasksFlow = tasksFlow

        let tasks = tasksFlow.rootViewController
        tasks.tabBarItem = UITabBarItem(title: "Tasks", image: UIImage(systemName: "checklist"), tag: 0)

        let accountScreen = UIHostingController(
            rootView: AccountPlaceholderScreen(name: account.name.isEmpty ? account.email : account.name, onLogout: onLogout)
        )
        accountScreen.title = "Account"
        let accountTab = UINavigationController(rootViewController: accountScreen)
        accountTab.tabBarItem = UITabBarItem(title: "Account", image: UIImage(systemName: "person.crop.circle"), tag: 1)

        tabBarController.viewControllers = [tasks, accountTab]
    }
}
