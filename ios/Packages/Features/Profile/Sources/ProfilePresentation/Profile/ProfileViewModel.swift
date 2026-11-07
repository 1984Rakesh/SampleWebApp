import DesignSystem
import Factory
import Foundation
import Observation
import ProfileDomain
import SharedDomain

struct ProfileViewState: Equatable {
    struct Content: Equatable {
        let name: String
        let email: String
        let initials: String
        let bio: String?
        let memberSince: String
    }

    var content: Loadable<Content> = .idle
    var banner: String?
    var isConfirmingSignOut = false
    var isSigningOut = false
}

@Observable
final class ProfileViewModel {
    enum Action: Equatable {
        case onAppear
        case refresh
        case edit
        case signOutTapped
        case confirmSignOut
        case cancelSignOut
        case dismissBanner
    }

    private(set) var state = ProfileViewState()

    @ObservationIgnored @Injected(\ProfileContainer.getProfile) private var getProfile
    @ObservationIgnored @Injected(\ProfileContainer.signOut) private var signOut
    @ObservationIgnored private weak var router: (any ProfileInternalRouting)?
    @ObservationIgnored private let locale: Locale
    @ObservationIgnored private var profile: Profile?
    @ObservationIgnored private var loadTask: Task<Void, Never>?

    init(router: any ProfileInternalRouting, locale: Locale = .current) {
        self.router = router
        self.locale = locale
    }

    /// Handles an action synchronously; async work runs in the returned task (ios §5.2).
    @discardableResult
    func send(_ action: Action) -> Task<Void, Never>? {
        switch action {
        case .onAppear, .refresh:
            return load()
        case .edit:
            guard let profile else { return nil }
            router?.showEdit(profile) { [weak self] in self?.send(.refresh) }
        case .signOutTapped:
            state.isConfirmingSignOut = true
        case .confirmSignOut:
            state.isConfirmingSignOut = false
            guard !state.isSigningOut else { return nil }
            state.isSigningOut = true
            // Success needs no navigation: the session change swaps the app's root.
            return Task { await signOut.execute() }
        case .cancelSignOut:
            state.isConfirmingSignOut = false
        case .dismissBanner:
            state.banner = nil
        }
        return nil
    }

    private func load() -> Task<Void, Never> {
        loadTask?.cancel()
        if profile == nil {
            state.content = .loading
        }
        let task = Task {
            do throws(DomainError) {
                let loaded = try await getProfile.execute()
                guard !Task.isCancelled else { return }
                profile = loaded
                state.content = .loaded(content(for: loaded))
            } catch {
                guard !Task.isCancelled, let message = error.message else { return }
                if profile == nil {
                    state.content = .failed(message)
                } else {
                    state.banner = message
                }
            }
        }
        loadTask = task
        return task
    }

    private func content(for profile: Profile) -> ProfileViewState.Content {
        let displayName = profile.name.isEmpty ? profile.email : profile.name
        let joined = Date(timeIntervalSince1970: profile.createdAt.secondsSince1970)
            .formatted(Date.FormatStyle(locale: locale).month(.wide).year())
        return ProfileViewState.Content(
            name: displayName,
            email: profile.email,
            initials: Self.initials(for: displayName),
            bio: profile.bio,
            memberSince: "Member since \(joined)"
        )
    }

    /// First letters of the first two words, uppercased.
    static func initials(for name: String) -> String {
        name.split(whereSeparator: \.isWhitespace)
            .prefix(2)
            .compactMap(\.first)
            .map { String($0).uppercased() }
            .joined()
    }
}
