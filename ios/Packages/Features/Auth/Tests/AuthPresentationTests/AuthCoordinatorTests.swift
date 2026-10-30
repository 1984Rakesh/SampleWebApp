import Testing
import UIKit
@testable import AuthPresentation

@Suite(.authContainer) struct AuthCoordinatorTests {
    @Test func startsOnLoginThenPushesAndPopsSignup() throws {
        AuthContainer.shared.login.register { StubLogin(result: .failure(.cancelled)) }
        AuthContainer.shared.register.register { StubRegister(result: .failure(.cancelled)) }
        let sut = AuthCoordinator(animated: false)
        let navigation = try #require(sut.rootViewController as? UINavigationController)
        #expect(navigation.viewControllers.count == 1)

        sut.showSignup()
        #expect(navigation.viewControllers.count == 2)
        #expect(navigation.viewControllers.last?.title == "Create account")

        sut.showLogin()
        #expect(navigation.viewControllers.count == 1)
    }
}
