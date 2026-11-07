// swift-tools-version: 6.2
import PackageDescription

// Presentation and the assembly default to the main actor; domain and data stay nonisolated (ios §2.4).
let mainActorByDefault: [SwiftSetting] = [
    .defaultIsolation(MainActor.self),
    .enableUpcomingFeature("InferIsolatedConformances"),
]

let package = Package(
    name: "Profile",
    platforms: [.iOS(.v17)],
    products: [
        // The only product: the assembly, which re-exports the public contracts (ios §1, shared §10).
        .library(name: "ProfileFeature", targets: ["ProfileFeature"]),
    ],
    dependencies: [
        .package(path: "../../Core"),
        .package(url: "https://github.com/hmlongco/Factory.git", exact: "2.4.12"),
    ],
    targets: [
        .target(
            name: "ProfileDomain",
            dependencies: [.product(name: "SharedDomain", package: "Core")]
        ),
        .target(
            name: "ProfileData",
            dependencies: [
                "ProfileDomain",
                .product(name: "SharedDomain", package: "Core"),
                .product(name: "Networking", package: "Core"),
            ]
        ),
        .target(
            name: "ProfilePresentation",
            dependencies: [
                "ProfileDomain",
                .product(name: "SharedDomain", package: "Core"),
                .product(name: "DesignSystem", package: "Core"),
                .product(name: "Factory", package: "Factory"),
            ],
            swiftSettings: mainActorByDefault
        ),
        .target(
            name: "ProfileFeature",
            dependencies: [
                "ProfileDomain",
                "ProfileData",
                "ProfilePresentation",
                .product(name: "Networking", package: "Core"),
                .product(name: "Factory", package: "Factory"),
            ],
            swiftSettings: mainActorByDefault
        ),
        .testTarget(
            name: "ProfileDomainTests",
            dependencies: ["ProfileDomain", .product(name: "SharedDomain", package: "Core")]
        ),
        .testTarget(
            name: "ProfileDataTests",
            dependencies: [
                "ProfileData",
                "ProfileDomain",
                .product(name: "SharedDomain", package: "Core"),
                .product(name: "Networking", package: "Core"),
            ]
        ),
        .testTarget(
            name: "ProfilePresentationTests",
            dependencies: [
                "ProfilePresentation",
                "ProfileDomain",
                .product(name: "SharedDomain", package: "Core"),
                .product(name: "Factory", package: "Factory"),
                .product(name: "FactoryTesting", package: "Factory"),
            ],
            swiftSettings: mainActorByDefault
        ),
    ],
    swiftLanguageModes: [.v6]
)
