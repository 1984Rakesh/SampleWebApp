@_exported import DashboardDomain
@_exported import DashboardPresentation
import Factory

/// Dashboard's only public entry point (shared §10). App supplies where tasks come from.
public enum DashboardAssembly {
    /// Registers the task source. Call once at launch.
    public static func configure(taskSource: any DashboardTaskSource) {
        DashboardContainer.shared.taskSource.register { taskSource }
    }

    /// A fresh dashboard for a signed-in user; `router` handles taps that lead to other features.
    public static func makeFlow(displayName: String, router: any DashboardExternalRouting) -> any DashboardFlow {
        DashboardCoordinator(displayName: displayName, router: router)
    }
}
