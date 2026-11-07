// swift-tools-version: 6.2
import PackageDescription

// Presentation and the assembly default to the main actor; domain and data stay nonisolated (ios §2.4).
let mainActorByDefault: [SwiftSetting] = [
    .defaultIsolation(MainActor.self),
    .enableUpcomingFeature("InferIsolatedConformances"),
]

let package = Package(
    name: "Auth",
    platforms: [.iOS(.v17)],
    products: [
        // The only product: the assembly, which re-exports the public contracts (ios §1, shared §10).
        .library(name: "AuthFeature", targets: ["AuthFeature"]),
    ],
    dependencies: [
        .package(path: "../../Core"),
        .package(url: "https://github.com/hmlongco/Factory.git", exact: "2.4.12"),
    ],
    targets: [
        .target(
            name: "AuthDomain",
            dependencies: [.product(name: "SharedDomain", package: "Core")]
        ),
        .target(
            name: "AuthData",
            dependencies: [
                "AuthDomain",
                .product(name: "SharedDomain", package: "Core"),
                .product(name: "Networking", package: "Core"),
                .product(name: "SecureStorage", package: "Core"),
            ]
        ),
        .target(
            name: "AuthPresentation",
            dependencies: [
                "AuthDomain",
                .product(name: "SharedDomain", package: "Core"),
                .product(name: "DesignSystem", package: "Core"),
                .product(name: "Factory", package: "Factory"),
            ],
            swiftSettings: mainActorByDefault
        ),
        .target(
            name: "AuthFeature",
            dependencies: [
                "AuthDomain",
                "AuthData",
                "AuthPresentation",
                .product(name: "Networking", package: "Core"),
                .product(name: "SecureStorage", package: "Core"),
                .product(name: "Factory", package: "Factory"),
            ],
            swiftSettings: mainActorByDefault
        ),
        .testTarget(
            name: "AuthDomainTests",
            dependencies: ["AuthDomain", .product(name: "SharedDomain", package: "Core")]
        ),
        .testTarget(
            name: "AuthDataTests",
            dependencies: [
                "AuthData",
                "AuthDomain",
                .product(name: "SharedDomain", package: "Core"),
                .product(name: "Networking", package: "Core"),
            ]
        ),
        .testTarget(
            name: "AuthPresentationTests",
            dependencies: [
                "AuthPresentation",
                "AuthDomain",
                .product(name: "SharedDomain", package: "Core"),
                .product(name: "Factory", package: "Factory"),
                .product(name: "FactoryTesting", package: "Factory"),
            ],
            swiftSettings: mainActorByDefault
        ),
    ],
    swiftLanguageModes: [.v6]
)
