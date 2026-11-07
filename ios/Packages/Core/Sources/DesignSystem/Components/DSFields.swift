import SwiftUI
import UIKit

/// Shared label, border and error layout for text inputs.
struct DSFieldContainer<Field: View>: View {
    let label: String
    let error: String?
    @ViewBuilder let field: Field

    var body: some View {
        VStack(alignment: .leading, spacing: DS.spacing.xs) {
            Text(label)
                .font(DS.font.label)
                .foregroundStyle(DS.color.text)
            field
                .font(DS.font.body)
                .foregroundStyle(DS.color.text)
                .padding(.horizontal, DS.spacing.md)
                .padding(.vertical, DS.spacing.sm)
                .frame(minHeight: DS.minimumHitTarget)
                .background(DS.color.surface, in: RoundedRectangle(cornerRadius: DS.radius.md))
                .overlay {
                    RoundedRectangle(cornerRadius: DS.radius.md)
                        .strokeBorder(error == nil ? DS.color.fieldBorder : DS.color.danger)
                }
            if let error {
                Text(error)
                    .font(DS.font.caption)
                    .foregroundStyle(DS.color.danger)
            }
        }
        .accessibilityElement(children: .contain)
    }
}

/// Labeled single-line text input with an optional error message.
public struct DSTextField: View {
    let label: String
    @Binding var text: String
    let prompt: String?
    let error: String?
    let contentType: UITextContentType?
    let keyboard: UIKeyboardType
    let capitalization: TextInputAutocapitalization

    public init(
        _ label: String,
        text: Binding<String>,
        prompt: String? = nil,
        error: String? = nil,
        contentType: UITextContentType? = nil,
        keyboard: UIKeyboardType = .default,
        capitalization: TextInputAutocapitalization = .sentences
    ) {
        self.label = label
        _text = text
        self.prompt = prompt
        self.error = error
        self.contentType = contentType
        self.keyboard = keyboard
        self.capitalization = capitalization
    }

    public var body: some View {
        DSFieldContainer(label: label, error: error) {
            TextField(label, text: $text, prompt: prompt.map { Text($0) })
                .textContentType(contentType)
                .keyboardType(keyboard)
                .textInputAutocapitalization(capitalization)
                .accessibilityHint(error ?? "")
        }
    }
}

/// Labeled secure input for passwords.
public struct DSSecureField: View {
    let label: String
    @Binding var text: String
    let error: String?
    let contentType: UITextContentType

    public init(_ label: String, text: Binding<String>, error: String? = nil, contentType: UITextContentType = .password) {
        self.label = label
        _text = text
        self.error = error
        self.contentType = contentType
    }

    public var body: some View {
        DSFieldContainer(label: label, error: error) {
            SecureField(label, text: $text)
                .textContentType(contentType)
                .accessibilityHint(error ?? "")
        }
    }
}

/// Labeled multi-line input that grows from 3 to 6 lines.
public struct DSTextArea: View {
    let label: String
    @Binding var text: String
    let prompt: String?
    let error: String?

    public init(_ label: String, text: Binding<String>, prompt: String? = nil, error: String? = nil) {
        self.label = label
        _text = text
        self.prompt = prompt
        self.error = error
    }

    public var body: some View {
        DSFieldContainer(label: label, error: error) {
            TextField(label, text: $text, prompt: prompt.map { Text($0) }, axis: .vertical)
                .lineLimit(3...6)
                .accessibilityHint(error ?? "")
        }
    }
}
