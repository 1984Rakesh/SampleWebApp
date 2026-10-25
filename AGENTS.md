# Agent Instructions

Read before changing code:
- Shared: [clean-architecture rules](./.devin/rules/clean-architecture.md).
- Client: [client/AGENTS.md](./client/AGENTS.md) and [client rules](./client/.devin/rules/client-architecture.md).
- Server: [server/AGENTS.md](./server/AGENTS.md) and [server rules](./server/.devin/rules/server-architecture.md).

The rule files are the source of truth; these AGENTS files only add workflow and verification.

## Workflow

1. Domain first: models, value types, errors, repository/port contracts, one use case per operation.
2. Data/infrastructure adapters with explicit mappings and boundary error translation.
3. Presentation: server schemas/controllers/routes; client mappers, ViewState, ViewModels and prop-driven screens.
4. Wire concrete implementations and cross-feature contracts only in App.
5. Update affected rules, AGENTS files and links in the same change.

## Verification

Run for each side you change, then `git diff --check` at the repository root. Fix any failure you introduce; never weaken a dependency-cruiser rule. Builds, tests and checks do not replace the manual-review items in shared §8.
