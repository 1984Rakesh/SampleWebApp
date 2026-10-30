import SwiftUI

/// A row that becomes a column at accessibility text sizes, so content wraps instead of truncating (ios §8.4).
public struct DSAdaptiveStack<Content: View>: View {
    let spacing: CGFloat
    let content: Content
    @Environment(\.dynamicTypeSize) private var dynamicTypeSize

    public init(spacing: CGFloat = DS.spacing.sm, @ViewBuilder content: () -> Content) {
        self.spacing = spacing
        self.content = content()
    }

    public var body: some View {
        let layout = dynamicTypeSize.isAccessibilitySize
            ? AnyLayout(VStackLayout(alignment: .leading, spacing: spacing))
            : AnyLayout(HStackLayout(alignment: .center, spacing: spacing))
        layout { content }
    }
}
