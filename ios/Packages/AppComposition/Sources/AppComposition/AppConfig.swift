import Foundation

/// Build-time configuration read from the app's Info.plist, which takes it from the `.xcconfig` (ios §4.5).
public struct AppConfig: Equatable, Sendable {
    public let apiBaseURL: URL

    public init(apiBaseURL: URL) {
        self.apiBaseURL = apiBaseURL
    }

    public enum LoadError: Error, Equatable {
        case missingKey(String)
        case invalidURL(String)
    }

    static let apiBaseURLKey = "APIBaseURL"

    /// Reads the configuration from an Info.plist dictionary.
    public static func load(from info: [String: Any]) throws(LoadError) -> AppConfig {
        guard let text = info[apiBaseURLKey] as? String, !text.isEmpty else {
            throw .missingKey(apiBaseURLKey)
        }
        guard let url = URL(string: text), let scheme = url.scheme, ["http", "https"].contains(scheme), url.host() != nil else {
            throw .invalidURL(text)
        }
        return AppConfig(apiBaseURL: url)
    }
}
