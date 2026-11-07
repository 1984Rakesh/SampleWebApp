import Testing
import UIKit
@testable import ProfilePresentation

@Suite(.profileContainer) struct ProfileCoordinatorTests {
    @Test func startsOnProfile() throws {
        ProfileContainer.shared.profileRepository.register { FakeProfileRepository() }
        ProfileContainer.shared.sessionEnding.register { RecordingSession() }
        let sut = ProfileCoordinator()
        let navigation = try #require(sut.rootViewController as? UINavigationController)

        #expect(navigation.viewControllers.map(\.title) == ["Profile"])
    }
}
