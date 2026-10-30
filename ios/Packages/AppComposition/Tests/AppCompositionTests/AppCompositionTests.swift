import Foundation
import SwiftUI
import Testing
import UIKit
@testable import AppComposition

@Suite struct AppConfigTests {
    @Test func loadsBaseURL() throws {
        let config = try AppConfig.load(from: ["APIBaseURL": "http://localhost:3001/api"])

        #expect(config.apiBaseURL == URL(string: "http://localhost:3001/api"))
    }

    @Test func missingKeyFails() {
        #expect(throws: AppConfig.LoadError.missingKey("APIBaseURL")) {
            try AppConfig.load(from: [:])
        }
    }

    @Test(arguments: ["localhost:3001", "ftp://example.com", "http://"])
    func invalidURLFails(text: String) {
        #expect(throws: AppConfig.LoadError.invalidURL(text)) {
            try AppConfig.load(from: ["APIBaseURL": text])
        }
    }
}

@Suite struct AppCoordinatorTests {
    @Test func startShowsSplash() throws {
        let window = UIWindow(frame: CGRect(x: 0, y: 0, width: 390, height: 844))
        let coordinator = AppCoordinator(window: window, config: AppConfig(apiBaseURL: URL(string: "http://localhost:3001/api")!))

        coordinator.start()

        #expect(window.rootViewController is UIHostingController<SplashScreen>)
    }
}
