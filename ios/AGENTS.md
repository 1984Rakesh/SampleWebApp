# iOS Agent Instructions (SwiftUI + UIKit)

Follow the [iOS rules](../.agents/skills/ios-architecture/SKILL.md), [shared rules](../.agents/skills/clean-architecture/SKILL.md) and [root instructions](../AGENTS.md).

## Layout

`TasksApp/` is the thin app target. `Packages/Core` holds SharedDomain, Networking, SecureStorage and DesignSystem; `Packages/Features/<Feature>` holds one package per feature (`Auth`, `Tasks`, `Dashboard`, `Profile`) with Domain, Data, Presentation and Feature (assembly) targets; `Packages/AppComposition` holds the app and main coordinators and cross-feature adapters.

The app talks to the existing server API in `../server`; run it locally for Debug builds. The simulator reaches it at `localhost`.

## Verification

```bash
cd ios
xcodebuild -scheme TasksApp -destination 'platform=iOS Simulator,name=iPhone 17' build test
```

Also run `swift test` in each package you change, then `git diff --check` at the repository root.
