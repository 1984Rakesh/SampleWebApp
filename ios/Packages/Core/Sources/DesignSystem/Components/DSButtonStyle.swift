import SwiftUI

/// Button style matching the web button variants. Use `.buttonStyle(.ds(.primary))`.
public struct DSButtonStyle: ButtonStyle {
    public enum Variant: Sendable {
        case primary
        case secondary
        case ghost
        case destructive
    }

    let variant: Variant
    let fullWidth: Bool

    public init(_ variant: Variant, fullWidth: Bool = true) {
        self.variant = variant
        self.fullWidth = fullWidth
    }

    public func makeBody(configuration: Configuration) -> some View {
        StyledLabel(configuration: configuration, variant: variant, fullWidth: fullWidth)
    }

    private struct StyledLabel: View {
        let configuration: Configuration
        let variant: Variant
        let fullWidth: Bool
        @Environment(\.isEnabled) private var isEnabled

        var body: some View {
            configuration.label
                .font(DS.font.label)
                .foregroundStyle(foreground)
                .padding(.horizontal, DS.spacing.lg)
                .frame(maxWidth: fullWidth ? .infinity : nil, minHeight: DS.minimumHitTarget)
                .background(background, in: RoundedRectangle(cornerRadius: DS.radius.md))
                .overlay {
                    if variant == .secondary {
                        RoundedRectangle(cornerRadius: DS.radius.md).strokeBorder(DS.color.border)
                    }
                }
                .contentShape(RoundedRectangle(cornerRadius: DS.radius.md))
                .opacity(isEnabled ? (configuration.isPressed ? 0.85 : 1) : 0.5)
        }

        private var foreground: Color {
            switch variant {
            case .primary: DS.color.onPrimary
            case .secondary: DS.color.onSurfaceSecondary
            case .ghost: DS.color.primary
            case .destructive: DS.color.onPrimary
            }
        }

        private var background: Color {
            switch variant {
            case .primary: DS.color.primary
            case .secondary: DS.color.surfaceSecondary
            case .ghost: .clear
            case .destructive: DS.color.danger
            }
        }
    }
}

extension ButtonStyle where Self == DSButtonStyle {
    public static func ds(_ variant: DSButtonStyle.Variant, fullWidth: Bool = true) -> DSButtonStyle {
        DSButtonStyle(variant, fullWidth: fullWidth)
    }
}
