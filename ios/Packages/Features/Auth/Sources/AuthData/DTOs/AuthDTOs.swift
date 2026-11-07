import Foundation

struct LoginRequestDTO: Encodable {
    let email: String
    let password: String
}

struct RegisterRequestDTO: Encodable {
    let name: String
    let email: String
    let password: String
}

struct RefreshRequestDTO: Encodable {
    let refreshToken: String
}

struct AccountResponseDTO: Decodable {
    let id: String?
    let name: String?
    let email: String?
}

struct AuthResponseDTO: Decodable {
    let user: AccountResponseDTO?
    let accessToken: String?
    let refreshToken: String?
}

struct RefreshResponseDTO: Decodable {
    let accessToken: String?
}

/// The session as stored in the Keychain. Field names are the stored format; keep them compatible.
package struct StoredSession: Codable, Equatable, Sendable {
    package struct StoredAccount: Codable, Equatable, Sendable {
        package let id: String
        package let name: String
        package let email: String
    }

    package var accessToken: String
    package let refreshToken: String
    package let account: StoredAccount
}
