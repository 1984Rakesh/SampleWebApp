---
name: ios-architecture
description: iOS (SwiftUI + UIKit navigation) clean-architecture rules (SPM layout and access control, Swift concurrency without @unchecked, domain errors, data/networking, ViewState and send(Action) ViewModels, feature coordinators, Factory DI, design system, verification). Use before changing code under ios/; read the shared clean-architecture skill too when a change crosses a boundary.
---

# iOS Clean Architecture Rules (SwiftUI + UIKit)

Extend the [shared rules](../clean-architecture/SKILL.md). Inside a feature: Presentation → Domain ← Data. Deployment target iOS 17.0, built with Xcode 26.3 / iOS 26 SDK, Swift 6.2 language mode, strict concurrency complete (toolchain and API rules in §10). Cite these sections as ios §n; keep numbers stable.

## 1. Packages, Targets and Access Control

```text
ios/
  TasksApp/                 thin app target: SceneDelegate → AppCoordinator.start()
  Packages/
    Core/                   SharedDomain · Networking · SecureStorage · DesignSystem
    Features/<Feature>/     <F>Domain · <F>Data · <F>Presentation · <F>Feature (assembly)
    AppComposition/         AppCoordinator · MainCoordinator · cross-feature adapters
```

| Target | May depend on | Must not depend on |
| :--- | :--- | :--- |
| `<F>Domain` | `SharedDomain` | Data, Presentation, Networking, UIKit, SwiftUI, Factory, other features |
| `<F>Data` | Own Domain, `SharedDomain`, `Networking`, `SecureStorage` | Presentation, UIKit, SwiftUI, other features |
| `<F>Presentation` | Own Domain, `SharedDomain`, `DesignSystem`, UIKit, SwiftUI, Factory | Data, Networking, other features |
| `<F>Feature` | All own targets, Core, Factory | Other features, AppComposition |
| `Core/*` | Other Core targets as needed | Features, AppComposition |
| `AppComposition` | `<F>Feature` products, Core | Any feature's Domain/Data/Presentation internals |

- The module is `Core`, never `Foundation` (Apple's framework name). The task model is `TaskItem` (Swift Concurrency owns `Task`).
- Each feature package exports one library product: its `<F>Feature` target, which re-exports the public contracts. Concrete types are `package` or `internal`; only shared §10 contracts are `public`. Tests use `@testable import`.
- A feature has only the layers it needs (Dashboard has no Data target).

## 2. Concurrency

1. No `@unchecked Sendable`, `nonisolated(unsafe)` or `@preconcurrency import`. Fix the type instead.
2. Models, DTOs and ViewState are `struct`/`enum` with Sendable members. Use cases, repositories and HTTP clients are `struct`s with only `let` Sendable properties; create `JSONDecoder`/`JSONEncoder` per call rather than storing them.
3. Mutable shared state (in-flight refresh, session broadcast) is an `actor`. Small synchronous state (an in-memory token cache) may use `OSAllocatedUnfairLock` from `os` (iOS 16+, Sendable) instead; `Mutex` needs iOS 18 and is not used. `AsyncStream` has one consumer; fan-out goes through an actor that owns the continuations.
4. Presentation, `<F>Feature`, AppComposition and DesignSystem targets use `.defaultIsolation(MainActor.self)` (Swift 6.2). Domain, Data and the other Core targets keep nonisolated defaults and do not enable `NonisolatedNonsendingByDefault`, so their async work leaves the main actor; if that feature is ever enabled there, mark decoding and other heavy Data work `@concurrent`.
5. Closures crossing isolation are `@Sendable` or `@MainActor`. Screens start work with `.task {}` so it is cancelled on disappear.

## 3. Domain

1. Contracts are `public protocol …: Sendable` with `async throws(DomainError)`. Use cases are one `public protocol <Operation>UseCase` per intent plus a `package struct Default<Operation>UseCase`.
2. `DomainError` (SharedDomain) cases: `validation`, `unauthorized`, `notFound`, `conflict`, plus iOS additions `unavailable` (offline, timeout, 5xx) and `cancelled`, each carrying a message except `cancelled`.
3. Tri-state patches use `Patch<Value> { keep, clear, set(Value) }` (shared §2).
4. Domain validators (title, email, password, name) are authoritative; ViewModels call them for field errors.

## 4. Data and Networking

1. `Networking` owns `HTTPClient`, `URLSessionHTTPClient`, `Endpoint` and `HTTPError { status, message }` parsed from `{ error }`. No third-party HTTP library.
2. Request and response DTOs are separate `Codable` structs per feature. Mappers normalize, validate, then build domain values; `Patch` maps to omitted / `null` / value.
3. Repositories translate `HTTPError` to `DomainError` (shared §4/§5 status mapping, backend message kept), `URLError`/5xx to `.unavailable`, and `CancellationError`/`URLError.cancelled` to `.cancelled`.
4. Auth owns `TokenStore` (Keychain) and `AuthenticatedHTTPClient`, a decorator that adds the bearer token, coalesces concurrent refreshes in an actor, retries once, and clears the session if refresh fails. Other features receive it only as `any HTTPClient`.
5. Base URL comes from `.xcconfig` per configuration; Debug allows an ATS exception for localhost only. No caching: screens refetch on appear and on pull-to-refresh.

## 5. Presentation

1. Each screen folder holds `<S>ViewState`, `<S>ViewModel`, `<S>Screen`, `<S>Container`. Screens render ViewState only, never domain types; mappers own domain → ViewState and `DomainError` → message.
2. ViewModels are `@MainActor @Observable final class` with `private(set) var state` and one `func send(_ action: Action) async`; `Action` is an `Equatable` enum. Screens receive `state` and a `send` closure; Containers own the ViewModel and call `.task { await viewModel.send(.onAppear) }`.
3. Async content uses `Loadable<Value>` (`idle / loading / loaded / failed(message)`); `.cancelled` is ignored silently.
4. Form errors appear on first submit, then update live.
5. Previews use ViewState fixtures, not ViewModels.

## 6. Navigation (shared §9)

1. Navigation is UIKit; every screen is hosted in a `UIHostingController`. SwiftUI screens never touch UIKit or routers directly; ViewModels call routing protocols.
2. Each feature owns a coordinator in `<F>Presentation/Navigation/` that implements its internal routing protocol (internal) and its inbound `public protocol <F>Flow` with `handle(_ route: <F>Route)`.
3. Outbound needs are `public protocol <F>ExternalRouting: AnyObject` in the feature's own vocabulary. AppComposition implements them and maps types between features.
4. AppCoordinator owns the window: splash while restoring the session, then root swap between the Auth flow and `MainCoordinator` (a `UITabBarController` with `viewControllers` and `UITabBarItem`s, one tab per feature flow; the iOS 18 `UITab` API is not used) driven by `SessionRepository.sessionChanges`. Deep links are out of scope.
5. ViewModels and coordinators hold routers `weak`. Sheets that change data take an `onSaved` callback so the presenting screen refetches.

## 7. Dependency Injection (shared §11)

1. Factory (`FactoryKit`) is the DI container. Each feature defines `package final class <F>Container: SharedContainer` with its own `manager`; no feature registers in `Container.shared` or another feature's container.
2. ViewModels, factories and coordinators resolve with `@Injected(\<F>Container.key)`; inside `@Observable` classes mark them `@ObservationIgnored`. Routers are passed at construction, never registered.
3. Cross-feature keys in a feature container have an unregistered default that fails fast; App fills them only through `<F>Assembly.configure(...)`.
4. User-scoped registrations use a custom `.session` scope. On sign-out App calls every `<F>Assembly.resetSession()`.
5. Tests override registrations inside the FactoryTesting `.container` trait (or a feature trait) so parallel tests stay isolated; if a custom container cannot be isolated, mark that suite `.serialized`.

## 8. Design System

1. `Core/DesignSystem` ports the web `client/src/index.css` tokens: colors in `Palette.swift` via dynamic `UIColor { traits in … }` (light and dark), radius `sm 9 · md 12 · lg 16 · card 18 · xl 20`, spacing scale. Fonts are SF Pro with Dynamic Type text styles.
2. Views use static semantic tokens (`DS.color.primary`, `DS.radius.card`); no hard-coded colors or sizes in features.
3. `DS*` components (`DSButton` styles, `DSTextField`, `DSSecureField`, `DSTextArea`, `DSCard`, `DSBadge`, `DSAvatar`, `DSProgress`, `DSEmptyState`, `DSErrorBanner`, `DSToast`, `DSSegmentedFilter`) take plain values (strings, `Tone`, closures), never feature or domain types.
4. Every component supports Dynamic Type, 44 pt hit targets, VoiceOver labels on icon-only controls and checked contrast in both palettes.

## 9. Verification

- `xcodebuild build test` for the app scheme and `xcodebuild test` for each changed package scheme, on the latest simulator (iPhone 17, iOS 26.3) and before a PR also on the minimum (iPhone 15, iOS 17.5), plus `git diff --check` at the repository root. Packages are iOS-only, so plain `swift test` on macOS is not used.
- Tests use Swift Testing: ViewModels with stubbed use cases, presentation mappers, data mappers and error translation.
- The dependency rule is enforced by SPM target dependencies; never add a target dependency that §1 forbids. Manual review: ViewState vs entity rendering, `public` surface limited to shared §10, no `@unchecked`, error translation, tri-state patches.

## 10. Toolchain and Platform APIs

1. Toolchain: Xcode 26.3, Swift 6.2 (`// swift-tools-version: 6.2`, `.swiftLanguageMode(.v6)`), iOS 26 SDK. Every package declares `platforms: [.iOS(.v17)]`; the app target's deployment target is iOS 17.0.
2. Freely usable (iOS 17 and earlier): `@Observable`, typed throws, `OSAllocatedUnfairLock`, `UITabBarController.viewControllers`, `@Entry` environment values (back-deployed macro), `.task`, `.refreshable`, `UISheetPresentationController` detents, `#Preview`. Not used: iOS 18 APIs such as `Mutex`, `UITab` and `@Previewable`; previews pass ViewState fixtures instead.
3. iOS 26-only APIs (`glassEffect`, `Task.immediate`, `UIHostingController` scene bridging, automatic UIKit observation tracking) are used only behind `if #available(iOS 26, *)` with an iOS 17 fallback (likewise any iOS 18 API, behind `#available(iOS 18, *)`), and only inside `Core/DesignSystem` or AppComposition, never in feature code.
4. Building with the iOS 26 SDK adopts Liquid Glass for system bars on iOS 26. Do not opt out (`UIDesignRequiresCompatibility`) and do not force opaque bar appearances; DesignSystem tokens style content, not system chrome.
5. Raise the deployment target only together with this section, `ios/AGENTS.md` and `plans/RULES.md`, and delete the `#available` fallbacks it makes dead.
