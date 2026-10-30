import SwiftUI

/// Rounded surface with the web card radius and border.
public struct DSCard<Content: View>: View {
    let content: Content

    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    public var body: some View {
        content
            .padding(DS.spacing.lg)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(DS.color.surface, in: RoundedRectangle(cornerRadius: DS.radius.card))
            .overlay {
                RoundedRectangle(cornerRadius: DS.radius.card).strokeBorder(DS.color.border)
            }
    }
}

/// Small pill label tinted by tone.
public struct DSBadge: View {
    let label: String
    let tone: Tone

    public init(_ label: String, tone: Tone = .neutral) {
        self.label = label
        self.tone = tone
    }

    public var body: some View {
        Text(label)
            .font(DS.font.caption.weight(.semibold))
            .foregroundStyle(tone.colors.foreground)
            .padding(.horizontal, DS.spacing.sm)
            .padding(.vertical, DS.spacing.xxs)
            .background(tone.colors.background, in: Capsule())
    }
}

/// Circle with initials; decorative unless given an accessibility label.
public struct DSAvatar: View {
    let initials: String
    let size: CGFloat
    let accessibilityName: String?

    public init(initials: String, size: CGFloat = 48, accessibilityName: String? = nil) {
        self.initials = initials
        self.size = size
        self.accessibilityName = accessibilityName
    }

    public var body: some View {
        Text(initials)
            .font(.system(size: size * 0.4, weight: .semibold))
            .foregroundStyle(DS.color.primary)
            .frame(width: size, height: size)
            .background(DS.color.accent, in: Circle())
            .accessibilityLabel(accessibilityName ?? "")
            .accessibilityHidden(accessibilityName == nil)
    }
}

/// Horizontal progress bar; `value` is clamped to 0...1.
public struct DSProgress: View {
    let value: Double
    let tone: Tone
    let accessibilityTitle: String

    public init(value: Double, tone: Tone = .info, accessibilityTitle: String) {
        self.value = min(max(value, 0), 1)
        self.tone = tone
        self.accessibilityTitle = accessibilityTitle
    }

    public var body: some View {
        GeometryReader { proxy in
            ZStack(alignment: .leading) {
                Capsule().fill(DS.color.surfaceSecondary)
                Capsule()
                    .fill(tone.colors.foreground)
                    .frame(width: proxy.size.width * value)
            }
        }
        .frame(height: 8)
        .accessibilityElement()
        .accessibilityLabel(accessibilityTitle)
        .accessibilityValue(Text(value, format: .percent.precision(.fractionLength(0))))
    }
}

/// Segmented control over plain options; features pass ids and labels, never domain enums.
public struct DSSegmentedFilter<ID: Hashable>: View {
    public struct Option: Identifiable {
        public let id: ID
        public let label: String

        public init(id: ID, label: String) {
            self.id = id
            self.label = label
        }
    }

    let title: String
    let options: [Option]
    @Binding var selection: ID

    public init(_ title: String, options: [Option], selection: Binding<ID>) {
        self.title = title
        self.options = options
        _selection = selection
    }

    public var body: some View {
        Picker(title, selection: $selection) {
            ForEach(options) { option in
                Text(option.label).tag(option.id)
            }
        }
        .pickerStyle(.segmented)
    }
}
