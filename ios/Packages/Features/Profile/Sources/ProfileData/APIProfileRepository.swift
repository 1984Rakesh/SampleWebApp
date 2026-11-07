import Foundation
import Networking
import ProfileDomain
import SharedDomain

/// `ProfileResponse` from the server. Every field is optional so the mapper can validate instead of crash.
struct ProfileResponseDTO: Decodable {
    let id: String?
    let name: String?
    let email: String?
    let avatar: String?
    let bio: String?
    let createdAt: String?
}

/// `PUT /users/me` body: omitted keeps, `null` clears, a value sets (shared §2).
struct UpdateProfileRequestDTO: Encodable, Equatable {
    var name: String?
    var bio: Patch<String> = .keep
    var avatar: Patch<String> = .keep

    private enum CodingKeys: String, CodingKey {
        case name, bio, avatar
    }

    func encode(to encoder: any Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encodeIfPresent(name, forKey: .name)
        for (patch, key) in [(bio, CodingKeys.bio), (avatar, .avatar)] {
            switch patch {
            case .keep: break
            case .clear: try container.encodeNil(forKey: key)
            case .set(let value): try container.encode(value, forKey: key)
            }
        }
    }
}

/// Normalizes then validates server profiles (shared §2).
enum ProfileMapper {
    static let unexpectedResponse = DomainError.unavailable("Unexpected server response")

    static func profile(from dto: ProfileResponseDTO) throws(DomainError) -> Profile {
        guard let id = nonEmpty(dto.id),
              let email = nonEmpty(dto.email),
              let createdAt = dto.createdAt.flatMap({ JSONCoding.parseDate($0.trimmedWhitespace) })
        else { throw unexpectedResponse }
        return Profile(
            id: id,
            name: dto.name?.trimmedWhitespace ?? "",
            email: email,
            avatar: nonEmpty(dto.avatar),
            bio: nonEmpty(dto.bio),
            createdAt: Timestamp(secondsSince1970: createdAt.timeIntervalSince1970)
        )
    }

    static func request(from changes: ProfileChanges) -> UpdateProfileRequestDTO {
        UpdateProfileRequestDTO(name: changes.name?.value, bio: changes.bio, avatar: changes.avatar)
    }

    private static func nonEmpty(_ text: String?) -> String? {
        guard let trimmed = text?.trimmedWhitespace, !trimmed.isEmpty else { return nil }
        return trimmed
    }
}

/// `ProfileRepository` over `/users/me`. `client` is the authenticated client App passes in (ios §4.4).
package struct APIProfileRepository: ProfileRepository {
    private let client: any HTTPClient

    package init(client: any HTTPClient) {
        self.client = client
    }

    package func currentProfile() async throws(DomainError) -> Profile {
        try await perform(Endpoint(method: .get, path: "/users/me"))
    }

    package func update(_ changes: ProfileChanges) async throws(DomainError) -> Profile {
        let endpoint: Endpoint
        do {
            endpoint = try Endpoint.json(.put, "/users/me", body: ProfileMapper.request(from: changes))
        } catch {
            throw error.domainError
        }
        return try await perform(endpoint)
    }

    // Raw HTTP errors appear here, so they are translated here (shared §4).
    private func perform(_ endpoint: Endpoint) async throws(DomainError) -> Profile {
        let dto: ProfileResponseDTO
        do {
            dto = try await client.send(endpoint).decode(ProfileResponseDTO.self)
        } catch {
            throw error.domainError
        }
        return try ProfileMapper.profile(from: dto)
    }
}
