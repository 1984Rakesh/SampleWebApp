import DesignSystem
import SwiftUI

/// Temporary signed-in root until the tab bar arrives with Tasks (P2), Dashboard (P3) and Profile (P4).
struct SignedInPlaceholderScreen: View {
    let name: String
    let onLogout: () -> Void

    var body: some View {
        VStack(spacing: DS.spacing.lg) {
            Text("Signed in as \(name)")
                .font(DS.font.title)
                .foregroundStyle(DS.color.text)
                .multilineTextAlignment(.center)
            Button("Log out", action: onLogout)
                .buttonStyle(.ds(.secondary, fullWidth: false))
        }
        .padding(DS.spacing.xl)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(DS.color.background)
    }
}

#Preview {
    SignedInPlaceholderScreen(name: "Ada Lovelace") {}
}
