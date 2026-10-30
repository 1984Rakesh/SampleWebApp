import SwiftUI
import UIKit

/// Light/dark color values ported from the web `client/src/index.css` tokens (ios §8.1).
///
/// Colors are dynamic `UIColor`s, so UIKit and SwiftUI both follow the current appearance.
public struct DSColors: Sendable {
    public let background: Color
    public let surface: Color
    public let text: Color
    public let textMuted: Color
    public let primary: Color
    public let onPrimary: Color
    public let surfaceSecondary: Color
    public let onSurfaceSecondary: Color
    public let surfaceMuted: Color
    public let accent: Color
    public let onAccent: Color
    public let danger: Color
    public let dangerBorder: Color
    public let border: Color
    public let input: Color
    public let focus: Color
    public let divider: Color
    public let link: Color
    public let success: Color
    public let onSuccess: Color
    public let warning: Color
    public let checkRing: Color
    public let overlay: Color

    nonisolated init() {
        background = Self.dynamic(light: .hex(0xF5F6FA), dark: .hex(0x0A0D13))
        surface = Self.dynamic(light: .hex(0xFFFFFF), dark: .hex(0x11151D))
        text = Self.dynamic(light: .hex(0x141824), dark: .hex(0xECEFF5))
        textMuted = Self.dynamic(light: .hex(0x5B6577), dark: .hex(0x98A2B5))
        primary = Self.dynamic(light: .hex(0x4655D4), dark: .hex(0x8C9EFF))
        onPrimary = Self.dynamic(light: .hex(0xFFFFFF), dark: .hex(0x0A0D13))
        surfaceSecondary = Self.dynamic(light: .hex(0xEBEDF2), dark: .hex(0x1E2430))
        onSurfaceSecondary = Self.dynamic(light: .hex(0x4A5468), dark: .hex(0xB5BDCC))
        surfaceMuted = Self.dynamic(light: .hex(0xF0F2F7), dark: .hex(0x0D1118))
        accent = Self.dynamic(light: .hex(0xE9ECFA), dark: .hex(0x232B3B))
        onAccent = Self.dynamic(light: .hex(0x141824), dark: .hex(0xECEFF5))
        danger = Self.dynamic(light: .hex(0xC23B2A), dark: .hex(0xFF9E8C))
        dangerBorder = Self.dynamic(light: .hex(0xF0C9C3), dark: .hex(0x3A2A2E))
        border = Self.dynamic(light: .hex(0xE4E7EE), dark: .hex(0x1E2430))
        input = Self.dynamic(light: .hex(0xCBD1DC), dark: .hex(0x2A3242))
        focus = Self.dynamic(light: .hex(0x4655D4), dark: .hex(0x8C9EFF))
        divider = Self.dynamic(light: .hex(0xECEDF3), dark: .hex(0x1B212C))
        link = Self.dynamic(light: .hex(0x3745B8), dark: .hex(0xA9B7FF))
        success = Self.dynamic(light: .hex(0x3FA663), dark: .hex(0x8FE3A8))
        onSuccess = Self.dynamic(light: .hex(0xFFFFFF), dark: .hex(0x0A0D13))
        warning = Self.dynamic(light: .hex(0x8A5A00), dark: .hex(0xF6C177))
        checkRing = Self.dynamic(light: .hex(0x8A94A8), dark: .hex(0x6B778E))
        overlay = Self.dynamic(light: .hex(0x141824, alpha: 0.5), dark: .hex(0x000000, alpha: 0.6))
    }

    /// Built in a nonisolated context so UIKit may call the provider from any thread.
    nonisolated static func dynamic(light: UIColor, dark: UIColor) -> Color {
        Color(uiColor: UIColor { traits in traits.userInterfaceStyle == .dark ? dark : light })
    }
}

extension UIColor {
    nonisolated static func hex(_ rgb: UInt32, alpha: CGFloat = 1) -> UIColor {
        UIColor(
            red: CGFloat((rgb >> 16) & 0xFF) / 255,
            green: CGFloat((rgb >> 8) & 0xFF) / 255,
            blue: CGFloat(rgb & 0xFF) / 255,
            alpha: alpha
        )
    }
}
