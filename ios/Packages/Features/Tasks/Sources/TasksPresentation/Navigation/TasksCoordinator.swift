import SwiftUI
import TasksDomain
import UIKit

/// Inbound routes other features can ask App to open (shared §9).
public enum TasksRoute: Equatable, Sendable {
    /// The list, filtered by status (`nil` shows all).
    case list(status: TaskStatus?)
    /// The list, showing open tasks whose due day has passed.
    case overdue
}

/// Tasks' inbound entry: App installs `rootViewController` in a tab and forwards routes.
public protocol TasksFlow: AnyObject {
    var rootViewController: UIViewController { get }
    func handle(_ route: TasksRoute)
}

/// Moves between Tasks' own screens; App never sees these routes.
protocol TasksInternalRouting: AnyObject {
    func showDetail(id: TaskID)
    func showForm(_ mode: TaskFormMode, onSaved: @escaping () -> Void)
    func closeForm()
    func closeDetail()
}

package final class TasksCoordinator: TasksFlow, TasksInternalRouting {
    private let navigationController = UINavigationController()
    /// Off in tests, where there is no window for transitions to finish in.
    private let animated: Bool
    private lazy var listViewModel = TaskListViewModel(router: self)

    package var rootViewController: UIViewController {
        navigationController
    }

    package init(animated: Bool = true) {
        self.animated = animated
        navigationController.navigationBar.prefersLargeTitles = true
        let list = UIHostingController(rootView: TaskListContainer(viewModel: listViewModel))
        list.title = "Tasks"
        list.navigationItem.rightBarButtonItem = UIBarButtonItem(
            systemItem: .add,
            primaryAction: UIAction { [weak self] _ in self?.listViewModel.send(.createTapped) }
        )
        list.navigationItem.rightBarButtonItem?.accessibilityLabel = "New task"
        navigationController.setViewControllers([list], animated: false)
    }

    package func handle(_ route: TasksRoute) {
        navigationController.presentedViewController?.dismiss(animated: false)
        navigationController.popToRootViewController(animated: false)
        switch route {
        case .list(let status):
            listViewModel.send(.filterChanged(TaskListFilter(status: status)))
        case .overdue:
            listViewModel.send(.filterChanged(.overdue))
        }
    }

    func showDetail(id: TaskID) {
        let detail = UIHostingController(rootView: TaskDetailContainer(viewModel: TaskDetailViewModel(id: id, router: self)))
        detail.navigationItem.largeTitleDisplayMode = .never
        navigationController.pushViewController(detail, animated: animated)
    }

    func showForm(_ mode: TaskFormMode, onSaved: @escaping () -> Void) {
        let viewModel = TaskFormViewModel(mode: mode, router: self, onSaved: onSaved)
        let form = UIHostingController(rootView: TaskFormContainer(viewModel: viewModel))
        form.title = viewModel.state.navigationTitle
        form.navigationItem.leftBarButtonItem = UIBarButtonItem(
            systemItem: .cancel,
            primaryAction: UIAction { _ in viewModel.send(.cancel) }
        )
        let sheet = UINavigationController(rootViewController: form)
        sheet.modalPresentationStyle = .pageSheet
        sheet.sheetPresentationController?.detents = [.large()]
        sheet.sheetPresentationController?.prefersGrabberVisible = true
        navigationController.present(sheet, animated: animated)
    }

    func closeForm() {
        navigationController.presentedViewController?.dismiss(animated: animated)
    }

    func closeDetail() {
        navigationController.popToRootViewController(animated: animated)
    }
}
