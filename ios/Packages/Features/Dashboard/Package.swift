// swift-tools-version: 6.2
import PackageDescription

// Presentation and the assembly default to the main actor; domain stays nonisolated (ios §2.4).
let mainActorByDefault: [SwiftSetting] = [
    .defaultIsolation(MainActor.self),
    .enableUpcomingFeature("InferIsolatedConformances"),
]

let package = Package(
    name: "Dashboard",
    platforms: [.iOS(.v17)],
    products: [
        // The only product: the assembly, which re-exports the public contracts (ios §1, shared §10).
        .library(name: "DashboardFeature", targets: ["DashboardFeature"]),
    ],
    dependencies: [
        .package(path: "../../Core"),
        .package(url: "https://github.com/hmlongco/Factory.git", exact: "2.4.12"),
    ],
    targets: [
        // No Data layer: tasks arrive through `DashboardTaskSource`, which App adapts (shared §1).
        .target(
            name: "DashboardDomain",
            dependencies: [.product(name: "SharedDomain", package: "Core")]
        ),
        .target(
            name: "DashboardPresentation",
            dependencies: [
                "DashboardDomain",
                .product(name: "SharedDomain", package: "Core"),
                .product(name: "DesignSystem", package: "Core"),
                .product(name: "Factory", package: "Factory"),
            ],
            swiftSettings: mainActorByDefault
        ),
        .target(
            name: "DashboardFeature",
            dependencies: [
                "DashboardDomain",
                "DashboardPresentation",
                .product(name: "Factory", package: "Factory"),
            ],
            swiftSettings: mainActorByDefault
        ),
        .testTarget(
            name: "DashboardDomainTests",
            dependencies: ["DashboardDomain", .product(name: "SharedDomain", package: "Core")]
        ),
        .testTarget(
            name: "DashboardPresentationTests",
            dependencies: [
                "DashboardPresentation",
                "DashboardDomain",
                .product(name: "SharedDomain", package: "Core"),
                .product(name: "DesignSystem", package: "Core"),
                .product(name: "Factory", package: "Factory"),
                .product(name: "FactoryTesting", package: "Factory"),
            ],
            swiftSettings: mainActorByDefault
        ),
    ],
    swiftLanguageModes: [.v6]
)
