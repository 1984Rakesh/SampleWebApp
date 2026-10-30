import SwiftUI

/// Feature-neutral emphasis for badges, banners and progress (ios §8.3).
///
/// Features map their own states to a tone; the design system never knows about tasks or priorities.
public enum Tone: Equatable, Sendable, CaseIterable {
    case neutral
    case info
    case success
    case warning
    case danger
    case calm
}

/// Background and foreground pair for a tone, ported from the web status/priority tokens.
struct ToneColors: Sendable {
    let background: Color
    let foreground: Color
}

extension Tone {
    nonisolated var colors: ToneColors {
        switch self {
        case .neutral:
            ToneColors(
                background: DSColors.dynamic(light: .hex(0xEBEDF2), dark: .hex(0x1E2430)),
                foreground: DSColors.dynamic(light: .hex(0x4A5468), dark: .hex(0xB5BDCC))
            )
        case .info:
            ToneColors(
                background: DSColors.dynamic(light: .hex(0xE6E9FC), dark: .hex(0x8C9EFF, alpha: 0.16)),
                foreground: DSColors.dynamic(light: .hex(0x3745B8), dark: .hex(0xA9B7FF))
            )
        case .success:
            ToneColors(
                background: DSColors.dynamic(light: .hex(0xDDF3E4), dark: .hex(0x6FD68C, alpha: 0.14)),
                foreground: DSColors.dynamic(light: .hex(0x1B6B3A), dark: .hex(0x8FE3A8))
            )
        case .warning:
            ToneColors(
                background: DSColors.dynamic(light: .hex(0xFDF0D5), dark: .hex(0xF4B860, alpha: 0.14)),
                foreground: DSColors.dynamic(light: .hex(0x8A5A00), dark: .hex(0xF6C177))
            )
        case .danger:
            ToneColors(
                background: DSColors.dynamic(light: .hex(0xFDE8E4), dark: .hex(0xFF8F7A, alpha: 0.14)),
                foreground: DSColors.dynamic(light: .hex(0xB4321F), dark: .hex(0xFF9E8C))
            )
        case .calm:
            ToneColors(
                background: DSColors.dynamic(light: .hex(0xDDF3EF), dark: .hex(0x6FD3C3, alpha: 0.14)),
                foreground: DSColors.dynamic(light: .hex(0x0B6B5E), dark: .hex(0x7FDCCB))
            )
        }
    }
}
