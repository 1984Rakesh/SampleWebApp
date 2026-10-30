// swift-tools-version: 6.2
import PackageDescription

// UI targets default to the main actor; domain, networking and storage stay nonisolated (ios §2.4).
let mainActorByDefault: [SwiftSetting] = [
    .defaultIsolation(MainActor.self),
    .enableUpcomingFeature("InferIsolatedConformances"),
]

let package = Package(
    name: "Core",
    platforms: [.iOS(.v17)],
    products: [
        .library(name: "SharedDomain", targets: ["SharedDomain"]),
        .library(name: "Networking", targets: ["Networking"]),
        .library(name: "SecureStorage", targets: ["SecureStorage"]),
        .library(name: "DesignSystem", targets: ["DesignSystem"]),
    ],
    targets: [
        .target(name: "SharedDomain"),
        .target(name: "Networking", dependencies: ["SharedDomain"]),
        .target(name: "SecureStorage"),
        .target(name: "DesignSystem", dependencies: ["SharedDomain"], swiftSettings: mainActorByDefault),
        .testTarget(name: "SharedDomainTests", dependencies: ["SharedDomain"]),
        .testTarget(name: "NetworkingTests", dependencies: ["Networking", "SharedDomain"]),
        .testTarget(name: "SecureStorageTests", dependencies: ["SecureStorage"]),
        .testTarget(name: "DesignSystemTests", dependencies: ["DesignSystem", "SharedDomain"], swiftSettings: mainActorByDefault),
    ],
    swiftLanguageModes: [.v6]
)
