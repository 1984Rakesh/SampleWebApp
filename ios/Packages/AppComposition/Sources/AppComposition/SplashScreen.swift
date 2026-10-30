import DesignSystem
import SwiftUI

/// Shown while the session is restored at launch.
struct SplashScreen: View {
    var body: some View {
        VStack(spacing: DS.spacing.lg) {
            Image(systemName: "checklist")
                .font(.system(size: 56, weight: .semibold))
                .foregroundStyle(DS.color.primary)
                .accessibilityHidden(true)
            Text("Tasks")
                .font(DS.font.display)
                .foregroundStyle(DS.color.text)
            ProgressView()
                .tint(DS.color.primary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(DS.color.background)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("Tasks, loading")
    }
}

#Preview {
    SplashScreen()
}
