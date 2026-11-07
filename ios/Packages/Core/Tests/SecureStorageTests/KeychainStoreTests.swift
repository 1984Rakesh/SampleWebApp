import Foundation
import Testing
import SecureStorage

/// Package tests run without a host app, where the simulator Keychain returns errSecMissingEntitlement (-34018).
/// These run wherever the Keychain is available; the app's hosted tests cover the same round trip.
private let keychainAvailable: Bool = {
    do throws(KeychainError) {
        _ = try KeychainStore(service: "tests.probe").data(for: "probe")
        return true
    } catch {
        return error.status != errSecMissingEntitlement
    }
}()

@Suite(.enabled(if: keychainAvailable, "Keychain needs a host app; covered by TasksAppTests"))
struct KeychainStoreTests {
    /// A unique service per test keeps parallel tests apart.
    private let store = KeychainStore(service: "tests.\(UUID().uuidString)")

    @Test func missingKeyReturnsNil() throws {
        #expect(try store.data(for: "token") == nil)
    }

    @Test func setThenReadReturnsValue() throws {
        defer { try? store.removeValue(for: "token") }
        try store.set(Data("abc".utf8), for: "token")

        #expect(try store.data(for: "token") == Data("abc".utf8))
    }

    @Test func setOverwritesExistingValue() throws {
        defer { try? store.removeValue(for: "token") }
        try store.set(Data("old".utf8), for: "token")
        try store.set(Data("new".utf8), for: "token")

        #expect(try store.data(for: "token") == Data("new".utf8))
    }

    @Test func removeDeletesValueAndToleratesMissingKey() throws {
        try store.set(Data("abc".utf8), for: "token")
        try store.removeValue(for: "token")
        try store.removeValue(for: "token")

        #expect(try store.data(for: "token") == nil)
    }
}
