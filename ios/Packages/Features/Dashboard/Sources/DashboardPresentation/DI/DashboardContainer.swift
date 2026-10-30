import DashboardDomain
import Factory

/// Dashboard's own DI container (ios §7.1). Test traits swap `shared` per test through `@TaskLocal`.
package nonisolated final class DashboardContainer: SharedContainer {
    @TaskLocal package static var shared = DashboardContainer()
    package let manager = ContainerManager()

    package init() {}
}

package nonisolated extension DashboardContainer {
    /// Registered by `DashboardAssembly.configure`; resolving it earlier is a wiring bug.
    var taskSource: Factory<any DashboardTaskSource> {
        self { fatalError("DashboardAssembly.configure must register the task source") }
    }

    var getSummary: Factory<any GetDashboardSummaryUseCase> {
        self { DefaultGetDashboardSummaryUseCase(source: self.taskSource()) }
    }
}
