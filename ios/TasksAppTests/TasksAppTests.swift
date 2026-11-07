import Foundation
import Security
import Testing
import UIKit
import AppComposition
import SecureStorage

/// Hosted in TasksApp, so the Keychain has the app's entitlements (package tests skip it).
@Suite struct KeychainStoreHostedTests {
    private let store = KeychainStore(service: "tests.\(UUID().uuidString)")

    @Test func roundTripsValue() throws {
        defer { try? store.removeValue(for: "token") }
        #expect(try store.data(for: "token") == nil)

        try store.set(Data("old".utf8), for: "token")
        try store.set(Data("new".utf8), for: "token")
        #expect(try store.data(for: "token") == Data("new".utf8))

        try store.removeValue(for: "token")
        #expect(try store.data(for: "token") == nil)
    }
}

@Suite struct BuildConfigurationTests {
    @Test func infoPlistHasValidAPIBaseURL() throws {
        let config = try AppConfig.load(from: Bundle.main.infoDictionary ?? [:])

        #if DEBUG
        #expect(config.apiBaseURL == URL(string: "http://localhost:3001/api"))
        #endif
    }

    @Test func sceneDelegateInstallsWindow() throws {
        let scene = try #require(UIApplication.shared.connectedScenes.first as? UIWindowScene)
        let delegate = try #require(scene.delegate as? UIWindowSceneDelegate)

        #expect(delegate.window??.rootViewController != nil)
    }
}
