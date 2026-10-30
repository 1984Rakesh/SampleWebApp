import SwiftUI

/// Centered spinner with an optional message.
public struct DSLoadingView: View {
    let message: String?

    public init(message: String? = nil) {
        self.message = message
    }

    public var body: some View {
        VStack(spacing: DS.spacing.md) {
            ProgressView()
                .tint(DS.color.primary)
            if let message {
                Text(message)
                    .font(DS.font.callout)
                    .foregroundStyle(DS.color.textMuted)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .accessibilityElement(children: .combine)
        .accessibilityLabel(message ?? "Loading")
    }
}

/// Icon, title, message and an optional action for empty or failed content.
public struct DSEmptyState: View {
    let systemImage: String
    let title: String
    let message: String?
    let actionTitle: String?
    let action: (() -> Void)?

    public init(
        systemImage: String,
        title: String,
        message: String? = nil,
        actionTitle: String? = nil,
        action: (() -> Void)? = nil
    ) {
        self.systemImage = systemImage
        self.title = title
        self.message = message
        self.actionTitle = actionTitle
        self.action = action
    }

    public var body: some View {
        VStack(spacing: DS.spacing.md) {
            Image(systemName: systemImage)
                .font(.largeTitle)
                .foregroundStyle(DS.color.textMuted)
                .accessibilityHidden(true)
            Text(title)
                .font(DS.font.headline)
                .foregroundStyle(DS.color.text)
            if let message {
                Text(message)
                    .font(DS.font.callout)
                    .foregroundStyle(DS.color.textMuted)
                    .multilineTextAlignment(.center)
            }
            if let actionTitle, let action {
                Button(actionTitle, action: action)
                    .buttonStyle(.ds(.secondary, fullWidth: false))
            }
        }
        .padding(DS.spacing.xl)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

/// Inline, non-blocking error with optional retry and dismiss actions.
public struct DSErrorBanner: View {
    let message: String
    let retryTitle: String
    let onRetry: (() -> Void)?
    let onDismiss: (() -> Void)?

    public init(_ message: String, retryTitle: String = "Retry", onRetry: (() -> Void)? = nil, onDismiss: (() -> Void)? = nil) {
        self.message = message
        self.retryTitle = retryTitle
        self.onRetry = onRetry
        self.onDismiss = onDismiss
    }

    public var body: some View {
        HStack(alignment: .firstTextBaseline, spacing: DS.spacing.sm) {
            Image(systemName: "exclamationmark.triangle.fill")
                .accessibilityHidden(true)
            Text(message)
                .font(DS.font.callout)
                .frame(maxWidth: .infinity, alignment: .leading)
            if let onRetry {
                Button(retryTitle, action: onRetry)
                    .font(DS.font.label)
                    .frame(minHeight: DS.minimumHitTarget)
            }
            if let onDismiss {
                Button(action: onDismiss) {
                    Image(systemName: "xmark")
                        .frame(width: DS.minimumHitTarget, height: DS.minimumHitTarget)
                }
                .accessibilityLabel("Dismiss")
            }
        }
        .foregroundStyle(DS.color.danger)
        .padding(.horizontal, DS.spacing.md)
        .background(Tone.danger.colors.background, in: RoundedRectangle(cornerRadius: DS.radius.md))
        .overlay {
            RoundedRectangle(cornerRadius: DS.radius.md).strokeBorder(DS.color.dangerBorder)
        }
        .accessibilityElement(children: .contain)
    }
}

/// Short confirmation message, tinted by tone. Presentation timing belongs to the caller.
public struct DSToast: View {
    let message: String
    let tone: Tone

    public init(_ message: String, tone: Tone = .success) {
        self.message = message
        self.tone = tone
    }

    public var body: some View {
        Text(message)
            .font(DS.font.label)
            .foregroundStyle(tone.colors.foreground)
            .padding(.horizontal, DS.spacing.lg)
            .padding(.vertical, DS.spacing.md)
            .background(DS.color.surface, in: Capsule())
            .overlay { Capsule().strokeBorder(tone.colors.background, lineWidth: 2) }
            .shadow(color: .black.opacity(0.12), radius: 12, y: 4)
            .accessibilityAddTraits(.isStaticText)
    }
}
