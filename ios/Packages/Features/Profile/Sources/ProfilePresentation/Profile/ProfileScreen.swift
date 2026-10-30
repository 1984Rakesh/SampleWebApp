import DesignSystem
import SwiftUI

struct ProfileContainerView: View {
    @State var viewModel: ProfileViewModel

    var body: some View {
        ProfileScreen(state: viewModel.state) { viewModel.send($0) }
            .refreshable { await viewModel.send(.refresh)?.value }
            .onAppear { viewModel.send(.onAppear) }
    }
}

struct ProfileScreen: View {
    let state: ProfileViewState
    let send: (ProfileViewModel.Action) -> Void

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DS.spacing.lg) {
                if let banner = state.banner {
                    DSErrorBanner(banner, onDismiss: { send(.dismissBanner) })
                }
                content
                Button("Log out") { send(.signOutTapped) }
                    .buttonStyle(.ds(.secondary))
                    .disabled(state.isSigningOut)
            }
            .padding(DS.spacing.lg)
        }
        .background(DS.color.background)
        .confirmationDialog(
            "Log out of Tasks?",
            isPresented: Binding(get: { state.isConfirmingSignOut }, set: { if !$0 { send(.cancelSignOut) } }),
            titleVisibility: .visible
        ) {
            Button("Log out", role: .destructive) { send(.confirmSignOut) }
            Button("Cancel", role: .cancel) { send(.cancelSignOut) }
        }
    }

    @ViewBuilder
    private var content: some View {
        switch state.content {
        case .idle, .loading:
            DSLoadingView(message: "Loading profile")
                .frame(minHeight: 200)
        case .failed(let message):
            DSEmptyState(systemImage: "exclamationmark.triangle", title: "Couldn't load your profile", message: message, actionTitle: "Try again") {
                send(.refresh)
            }
        case .loaded(let content):
            DSCard {
                HStack(spacing: DS.spacing.lg) {
                    DSAvatar(initials: content.initials, size: 64)
                    VStack(alignment: .leading, spacing: DS.spacing.xs) {
                        Text(content.name)
                            .font(DS.font.title)
                            .foregroundStyle(DS.color.text)
                        Text(content.email)
                            .font(DS.font.callout)
                            .foregroundStyle(DS.color.textMuted)
                        Text(content.memberSince)
                            .font(DS.font.caption)
                            .foregroundStyle(DS.color.textMuted)
                    }
                }
                .accessibilityElement(children: .combine)
            }
            DSCard {
                VStack(alignment: .leading, spacing: DS.spacing.sm) {
                    Text("About")
                        .font(DS.font.label)
                        .foregroundStyle(DS.color.textMuted)
                    Text(content.bio ?? "Add a short bio so teammates know what you work on.")
                        .font(DS.font.body)
                        .foregroundStyle(content.bio == nil ? DS.color.textMuted : DS.color.text)
                }
            }
            Button("Edit profile") { send(.edit) }
                .buttonStyle(.ds(.primary))
        }
    }
}

#Preview("Loaded") {
    ProfileScreen(state: ProfileViewState(content: .loaded(.init(
        name: "Ada Lovelace", email: "ada@example.com", initials: "AL",
        bio: "Writes the first programs.", memberSince: "Member since October 2026"
    )))) { _ in }
}

#Preview("No bio") {
    ProfileScreen(state: ProfileViewState(content: .loaded(.init(
        name: "Ada", email: "ada@example.com", initials: "A", bio: nil, memberSince: "Member since October 2026"
    )))) { _ in }
}
