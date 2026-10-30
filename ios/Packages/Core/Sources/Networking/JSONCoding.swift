import Foundation

/// JSON coding for the API contract: camelCase keys, ISO-8601 UTC timestamps (shared §5).
///
/// Coders are created per call rather than stored, so nothing here needs to be Sendable (ios §2.2).
public enum JSONCoding {
    public static func decoder() -> JSONDecoder {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .custom { decoder in
            let container = try decoder.singleValueContainer()
            let text = try container.decode(String.self)
            guard let date = parseDate(text) else {
                throw DecodingError.dataCorruptedError(
                    in: container,
                    debugDescription: "Expected an ISO-8601 timestamp, got \(text)"
                )
            }
            return date
        }
        return decoder
    }

    public static func encoder() -> JSONEncoder {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .custom { date, encoder in
            var container = encoder.singleValueContainer()
            try container.encode(formatDate(date))
        }
        return encoder
    }

    /// Parses ISO-8601 with or without fractional seconds.
    public static func parseDate(_ text: String) -> Date? {
        let withFraction = Date.ISO8601FormatStyle(includingFractionalSeconds: true)
        let withoutFraction = Date.ISO8601FormatStyle()
        return (try? withFraction.parse(text)) ?? (try? withoutFraction.parse(text))
    }

    /// Formats as ISO-8601 UTC with milliseconds, matching JavaScript's `toISOString()`.
    public static func formatDate(_ date: Date) -> String {
        Date.ISO8601FormatStyle(includingFractionalSeconds: true).format(date)
    }
}
