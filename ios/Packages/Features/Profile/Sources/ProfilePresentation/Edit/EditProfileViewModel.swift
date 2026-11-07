import DesignSystem
import Factory
import Observation
import ProfileDomain
import SharedDomain

struct EditProfileViewState: Equatable {
    var name = ""
    var bio = ""
    var nameError: String?
    var errorMessage: String?
    var isSaving = false
}

@Observable
final class EditProfileViewModel {
    enum Action: Equatable {
        case nameChanged(String)
        case bioChanged(String)
        case save
        case cancel
        case dismissError
    }

    private(set) var state = EditProfileViewState()

    @ObservationIgnored @Injected(\ProfileContainer.updateProfile) private var updateProfile
    @ObservationIgnored private let original: Profile
    @ObservationIgnored private weak var router: (any ProfileInternalRouting)?
    @ObservationIgnored private let onSaved: () -> Void
    @ObservationIgnored private var hasSubmitted = false

    init(profile: Profile, router: any ProfileInternalRouting, onSaved: @escaping () -> Void) {
        original = profile
        self.router = router
        self.onSaved = onSaved
        state.name = profile.name
        state.bio = profile.bio ?? ""
    }

    /// Handles an action synchronously; async work runs in the returned task (ios §5.2).
    @discardableResult
    func send(_ action: Action) -> Task<Void, Never>? {
        switch action {
        case .nameChanged(let name):
            state.name = name
            if hasSubmitted { validate() }
        case .bioChanged(let bio):
            state.bio = bio
        case .save:
            return save()
        case .cancel:
            router?.closeEdit()
        case .dismissError:
            state.errorMessage = nil
        }
        return nil
    }

    private func save() -> Task<Void, Never>? {
        hasSubmitted = true
        validate()
        guard state.nameError == nil, !state.isSaving else { return nil }
        state.isSaving = true
        state.errorMessage = nil
        let draft = state
        return Task {
            do throws(DomainError) {
                _ = try await updateProfile.execute(original, changes: try changes(from: draft))
                onSaved()
                router?.closeEdit()
            } catch {
                state.errorMessage = error.message
            }
            state.isSaving = false
        }
    }

    /// Only what the user changed, so untouched fields are never sent (shared §2).
    private func changes(from draft: EditProfileViewState) throws(DomainError) -> ProfileChanges {
        var changes = ProfileChanges()
        let name = try ProfileName(draft.name)
        if name.value != original.name { changes.name = name }
        let bio = draft.bio.trimmedWhitespace
        if bio != (original.bio ?? "") { changes.bio = bio.isEmpty ? .clear : .set(bio) }
        return changes
    }

    private func validate() {
        do throws(DomainError) {
            _ = try ProfileName(state.name)
            state.nameError = nil
        } catch {
            state.nameError = error.message
        }
    }
}
