import Testing
import SharedDomain

@Suite struct PatchTests {
    @Test func keepPreservesCurrentValue() {
        #expect(Patch<String>.keep.applied(to: "bio") == "bio")
        #expect(Patch<String>.keep.applied(to: nil) == nil)
    }

    @Test func clearRemovesValue() {
        #expect(Patch<String>.clear.applied(to: "bio") == nil)
    }

    @Test func setReplacesValue() {
        #expect(Patch.set("new").applied(to: "old") == "new")
        #expect(Patch.set("new").applied(to: nil) == "new")
    }
}

@Suite struct DomainErrorTests {
    @Test(arguments: [
        DomainError.validation("a"), .unauthorized("a"), .notFound("a"), .conflict("a"), .unavailable("a"),
    ])
    func messageIsKept(error: DomainError) {
        #expect(error.message == "a")
    }

    @Test func cancelledHasNoMessage() {
        #expect(DomainError.cancelled.message == nil)
    }
}
