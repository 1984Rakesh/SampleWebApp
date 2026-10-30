import SwiftUI

/// Static semantic design tokens (ios §8.2). Features use these instead of literal colors or sizes.
public enum DS {
    public static let color = DSColors()
    public static let radius = DSRadius()
    public static let spacing = DSSpacing()
    public static let font = DSFonts()

    /// Minimum hit target for interactive controls (ios §8.4).
    public static let minimumHitTarget: CGFloat = 44
}

/// Corner radii from the web `--radius-*` tokens.
public struct DSRadius: Sendable {
    public let sm: CGFloat = 9
    public let md: CGFloat = 12
    public let lg: CGFloat = 16
    public let card: CGFloat = 18
    public let xl: CGFloat = 20
    public let xxl: CGFloat = 24
}

public struct DSSpacing: Sendable {
    public let xxs: CGFloat = 2
    public let xs: CGFloat = 4
    public let sm: CGFloat = 8
    public let md: CGFloat = 12
    public let lg: CGFloat = 16
    public let xl: CGFloat = 24
    public let xxl: CGFloat = 32
}

/// SF Pro text styles, so every size follows Dynamic Type.
public struct DSFonts: Sendable {
    public let display: Font = .largeTitle.weight(.bold)
    public let title: Font = .title2.weight(.semibold)
    public let headline: Font = .headline
    public let body: Font = .body
    public let callout: Font = .callout
    public let label: Font = .subheadline.weight(.medium)
    public let caption: Font = .caption
}
