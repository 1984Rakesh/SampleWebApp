# iOS Agent Instructions (SwiftUI + UIKit)

Follow the [iOS rules](../.agents/skills/ios-architecture/SKILL.md), [shared rules](../.agents/skills/clean-architecture/SKILL.md) and [root instructions](../AGENTS.md).

## Layout

`TasksApp/` is the thin app target. `Packages/Core` holds SharedDomain, Networking, SecureStorage and DesignSystem; `Packages/Features/<Feature>` holds one package per feature (`Auth`, `Tasks`, `Dashboard`, `Profile`) with Domain, Data, Presentation and Feature (assembly) targets; `Packages/AppComposition` holds the app and main coordinators and cross-feature adapters.

The app talks to the existing server API in `../server`; run it locally for Debug builds. The simulator reaches it at `localhost`.

## Verification

Requires Xcode 26.3 (Swift 6.2, iOS 26 SDK). Deployment target is iOS 17.0.

Latest OS (every change):

```bash
xcodebuild -scheme TasksApp -destination 'platform=iOS Simulator,name=iPhone 17' build test
```

Minimum OS (before opening a PR):

```bash
xcodebuild -scheme TasksApp -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.5' build test
```

`iPhone 17` exists only on the iOS 26.3.1 runtime, so it needs no `OS=`. Also run `xcodebuild test -scheme <Scheme> -destination 'platform=iOS Simulator,name=iPhone 17'` inside each package you change (`Packages/Core` → `Core-Package`, `Packages/Features/Auth` → `Auth`, `Packages/Features/Tasks` → `Tasks`, `Packages/Features/Dashboard` → `Dashboard`, `Packages/AppComposition` → `AppComposition`), then `git diff --check` at the repository root.
