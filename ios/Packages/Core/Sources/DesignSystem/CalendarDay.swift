import Foundation
import SharedDomain

/// Calendar days stored as UTC midnight, the way the API's date-only values are read (ios §4.5).
///
/// The user works in their own calendar; these helpers keep the same year/month/day across the conversion.
public enum CalendarDay {
    private static let utc: Calendar = {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = .gmt
        return calendar
    }()

    /// UTC midnight of `date`'s day in `calendar`.
    public static func timestamp(for date: Date, calendar: Calendar) -> Timestamp {
        let day = calendar.dateComponents([.year, .month, .day], from: date)
        let midnight = utc.date(from: day) ?? date
        return Timestamp(secondsSince1970: midnight.timeIntervalSince1970)
    }

    /// Noon of the stored day in `calendar`, for a date picker.
    public static func date(for timestamp: Timestamp, calendar: Calendar) -> Date {
        var day = utc.dateComponents([.year, .month, .day], from: Date(timeIntervalSince1970: timestamp.secondsSince1970))
        day.hour = 12
        return calendar.date(from: day) ?? Date(timeIntervalSince1970: timestamp.secondsSince1970)
    }

    /// "Oct 30" in `locale`, for the stored day.
    public static func format(_ timestamp: Timestamp, locale: Locale) -> String {
        Date(timeIntervalSince1970: timestamp.secondsSince1970)
            .formatted(Date.FormatStyle(locale: locale, timeZone: .gmt).month(.abbreviated).day())
    }
}
