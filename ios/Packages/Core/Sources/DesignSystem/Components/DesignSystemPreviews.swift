import SwiftUI

#Preview("Components") {
    @Previewable @State var email = "ada@example.com"
    @Previewable @State var password = ""
    @Previewable @State var filter = "all"

    ScrollView {
        VStack(alignment: .leading, spacing: DS.spacing.lg) {
            Text("Design system").font(DS.font.display)
            DSTextField("Email", text: $email, contentType: .emailAddress, keyboard: .emailAddress, capitalization: .never)
            DSSecureField("Password", text: $password, error: "Password is required")
            DSSegmentedFilter("Filter", options: [.init(id: "all", label: "All"), .init(id: "open", label: "Open")], selection: $filter)
            HStack {
                ForEach(Tone.allCases, id: \.self) { tone in
                    DSBadge("\(tone)", tone: tone)
                }
            }
            DSCard {
                HStack {
                    DSAvatar(initials: "AL", accessibilityName: "Ada Lovelace")
                    DSProgress(value: 0.6, accessibilityTitle: "Completed")
                }
            }
            DSErrorBanner("Could not load tasks", onRetry: {}, onDismiss: {})
            Button("Primary") {}.buttonStyle(.ds(.primary))
            Button("Secondary") {}.buttonStyle(.ds(.secondary))
            Button("Ghost") {}.buttonStyle(.ds(.ghost))
            Button("Delete") {}.buttonStyle(.ds(.destructive))
            DSToast("Saved")
        }
        .padding(DS.spacing.lg)
    }
    .background(DS.color.background)
}
