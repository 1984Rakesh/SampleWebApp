import DesignSystem
import SwiftUI

/// Temporary Account tab with logout until the Profile feature arrives (P4).
struct AccountPlaceholderScreen: View {
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
    AccountPlaceholderScreen(name: "Ada Lovelace") {}
}
