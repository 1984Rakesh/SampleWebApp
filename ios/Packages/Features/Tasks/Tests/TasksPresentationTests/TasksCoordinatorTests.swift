import Testing
import UIKit
import TasksDomain
@testable import TasksPresentation

@Suite(.tasksContainer) struct TasksCoordinatorTests {
    @Test func startsOnListAndPushesDetail() throws {
        TasksContainer.shared.taskRepository.register { FakeTaskRepository() }
        let sut = TasksCoordinator(animated: false)
        let navigation = try #require(sut.rootViewController as? UINavigationController)
        #expect(navigation.viewControllers.map(\.title) == ["Tasks"])

        sut.showDetail(id: TaskID("1"))

        #expect(navigation.viewControllers.count == 2)
    }

    @Test func inboundRoutePopsToList() throws {
        TasksContainer.shared.taskRepository.register { FakeTaskRepository() }
        let sut = TasksCoordinator(animated: false)
        let navigation = try #require(sut.rootViewController as? UINavigationController)
        sut.showDetail(id: TaskID("1"))

        sut.handle(.overdue)

        #expect(navigation.viewControllers.count == 1)
    }
}
