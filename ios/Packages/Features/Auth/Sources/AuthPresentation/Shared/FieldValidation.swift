import SharedDomain

/// Runs a domain validator and turns its failure into a field message (ios §3.4, §5.4).
enum FieldValidation {
    static func message(_ validate: () throws(DomainError) -> Void) -> String? {
        do {
            try validate()
            return nil
        } catch {
            return error.message
        }
    }
}
