import DesignSystem
import SwiftUI

/// Title and subtitle at the top of the auth screens.
struct AuthHeader: View {
    let title: String
    let subtitle: String

    var body: some View {
        VStack(alignment: .leading, spacing: DS.spacing.xs) {
            Text(title)
                .font(DS.font.display)
                .foregroundStyle(DS.color.text)
                .accessibilityAddTraits(.isHeader)
            Text(subtitle)
                .font(DS.font.callout)
                .foregroundStyle(DS.color.textMuted)
        }
        .padding(.bottom, DS.spacing.sm)
    }
}

/// Primary button that shows a spinner and ignores taps while a request is running.
struct SubmitButton: View {
    let title: String
    let isSubmitting: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            ZStack {
                Text(title).opacity(isSubmitting ? 0 : 1)
                if isSubmitting {
                    ProgressView().tint(DS.color.onPrimary)
                }
            }
        }
        .buttonStyle(.ds(.primary))
        .disabled(isSubmitting)
        .accessibilityLabel(isSubmitting ? "\(title), in progress" : title)
    }
}
