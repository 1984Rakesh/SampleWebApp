# Agent Instructions

Read before changing code:
- Shared: [clean-architecture rules](./.agents/skills/clean-architecture/SKILL.md).
- Client: [client/AGENTS.md](./client/AGENTS.md) and [client rules](./.agents/skills/client-architecture/SKILL.md).
- Server: [server/AGENTS.md](./server/AGENTS.md) and [server rules](./.agents/skills/server-architecture/SKILL.md).
- iOS: [ios/AGENTS.md](./ios/AGENTS.md) and [iOS rules](./.agents/skills/ios-architecture/SKILL.md).

The rule files are agent skills (loaded on demand, not injected every turn) and the source of truth; these AGENTS files only add workflow and verification.

## Workflow

1. Domain first: models, value types, errors, repository/port contracts, one use case per operation.
2. Data/infrastructure adapters with explicit mappings and boundary error translation.
3. Presentation: server schemas/controllers/routes; client and iOS mappers, ViewState, ViewModels, prop-driven screens and the feature's internal navigation.
4. Build each feature's internals in its assembly; link features and cross-feature contracts only in App (shared §9–§11).
5. Update affected rules, AGENTS files and links in the same change.

## Verification

Run for each side you change, then `git diff --check` at the repository root. Fix any failure you introduce; never weaken a dependency-cruiser rule. Builds, tests and checks do not replace the manual-review items in shared §8.
