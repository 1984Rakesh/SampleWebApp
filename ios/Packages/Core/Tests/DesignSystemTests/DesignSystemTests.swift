import Foundation
import Testing
import SharedDomain
@testable import DesignSystem

@Suite struct CalendarDayTests {
    private func calendar(_ identifier: String) -> Calendar {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = TimeZone(identifier: identifier)!
        return calendar
    }

    /// 2026-10-30 00:00 UTC.
    private let october30 = Timestamp(secondsSince1970: 1_793_318_400)

    @Test(arguments: ["Pacific/Honolulu", "UTC", "Asia/Tokyo", "Pacific/Kiritimati"])
    func localDayMapsToUTCMidnightOfSameDay(zone: String) {
        let calendar = calendar(zone)
        let lateEvening = calendar.date(from: DateComponents(year: 2026, month: 10, day: 30, hour: 23, minute: 30))!
        let earlyMorning = calendar.date(from: DateComponents(year: 2026, month: 10, day: 30, hour: 0, minute: 15))!

        #expect(CalendarDay.timestamp(for: lateEvening, calendar: calendar) == october30)
        #expect(CalendarDay.timestamp(for: earlyMorning, calendar: calendar) == october30)
    }

    @Test(arguments: ["Pacific/Honolulu", "UTC", "Asia/Tokyo"])
    func storedDayRoundTripsThroughDatePicker(zone: String) {
        let calendar = calendar(zone)
        let picked = CalendarDay.date(for: october30, calendar: calendar)

        #expect(calendar.component(.day, from: picked) == 30)
        #expect(CalendarDay.timestamp(for: picked, calendar: calendar) == october30)
    }

    @Test func formatsStoredDayRegardlessOfDeviceZone() {
        #expect(CalendarDay.format(october30, locale: Locale(identifier: "en_US")) == "Oct 30")
    }
}

@Suite struct LoadableTests {
    @Test func valueOnlyWhenLoaded() {
        #expect(Loadable<Int>.loaded(3).value == 3)
        #expect(Loadable<Int>.loading.value == nil)
        #expect(Loadable<Int>.failed("x").value == nil)
        #expect(Loadable<Int>.idle.value == nil)
    }
}
