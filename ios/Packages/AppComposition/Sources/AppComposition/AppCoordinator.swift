import AuthFeature
import DashboardFeature
import Networking
import ProfileFeature
import SwiftUI
import TasksFeature
import UIKit

/// What the shell needs from the features, so tests can drive the root swap without their internals.
struct AppServices {
    let restore: any RestoreSessionUseCase
    let observe: any ObserveSessionUseCase
    let makeAuthFlow: () -> any AuthFlow
    let makeTasksFlow: () -> any TasksFlow
    let makeDashboardFlow: (String, any DashboardExternalRouting) -> any DashboardFlow
    let makeProfileFlow: () -> any ProfileFlow
    /// Drops every feature's user-scoped registrations (ios §7.4).
    let resetUserSessions: () -> Void
}

/// Owns the window and its root (ios §6.4): splash while the session is restored, then the Auth flow
/// or the signed-in tab bar, swapped whenever the session changes. It never navigates inside a feature.
public final class AppCoordinator: Coordinator {
    static let keychainService = "dev.samplewebapp.TasksApp.session"

    private let window: UIWindow
    private let services: AppServices
    private var authFlow: (any AuthFlow)?
    private var main: MainCoordinator?
    private var renderedState: SessionState?

    public convenience init(window: UIWindow, config: AppConfig) {
        AuthAssembly.configure(
            publicClient: URLSessionHTTPClient(baseURL: config.apiBaseURL),
            keychainService: Self.keychainService
        )
        TasksAssembly.configure(client: AuthAssembly.authenticatedClient())
        DashboardAssembly.configure(taskSource: TasksDashboardSource(getTasks: { TasksAssembly.getTasks() }))
        ProfileAssembly.configure(
            client: AuthAssembly.authenticatedClient(),
            sessionEnding: AuthSessionEnding(logout: AuthAssembly.logout())
        )
        self.init(
            window: window,
            services: AppServices(
                restore: AuthAssembly.restoreSession(),
                observe: AuthAssembly.observeSession(),
                makeAuthFlow: AuthAssembly.makeFlow,
                makeTasksFlow: TasksAssembly.makeFlow,
                makeDashboardFlow: { DashboardAssembly.makeFlow(displayName: $0, router: $1) },
                makeProfileFlow: ProfileAssembly.makeFlow,
                resetUserSessions: {
                    TasksAssembly.resetSession()
                    ProfileAssembly.resetSession()
                }
            )
        )
    }

    init(window: UIWindow, services: AppServices) {
        self.window = window
        self.services = services
    }

    public func start() {
        setRoot(UIHostingController(rootView: SplashScreen()), animated: false)
        window.makeKeyAndVisible()
        Task { [weak self, services] in
            _ = await services.restore.execute()
            for await state in await services.observe.execute() {
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
            main = nil
            services.resetUserSessions()
            let flow = services.makeAuthFlow()
            authFlow = flow
            setRoot(flow.rootViewController, animated: true)
        case .signedIn(let account):
            authFlow = nil
            let main = MainCoordinator(
                account: account,
                tasksFlow: services.makeTasksFlow(),
                profileFlow: services.makeProfileFlow(),
                makeDashboardFlow: services.makeDashboardFlow
            )
            self.main = main
            setRoot(main.tabBarController, animated: true)
        }
    }

    /// Swaps the window's root with a cross-dissolve.
    func setRoot(_ viewController: UIViewController, animated: Bool) {
        window.rootViewController = viewController
        guard animated else { return }
        UIView.transition(with: window, duration: 0.25, options: .transitionCrossDissolve, animations: nil)
    }
}
