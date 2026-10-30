// swift-tools-version: 6.2
import PackageDescription

// Presentation and the assembly default to the main actor; domain and data stay nonisolated (ios §2.4).
let mainActorByDefault: [SwiftSetting] = [
    .defaultIsolation(MainActor.self),
    .enableUpcomingFeature("InferIsolatedConformances"),
]

let package = Package(
    name: "Tasks",
    platforms: [.iOS(.v17)],
    products: [
        // The only product: the assembly, which re-exports the public contracts (ios §1, shared §10).
        .library(name: "TasksFeature", targets: ["TasksFeature"]),
    ],
    dependencies: [
        .package(path: "../../Core"),
        .package(url: "https://github.com/hmlongco/Factory.git", exact: "2.4.12"),
    ],
    targets: [
        .target(
            name: "TasksDomain",
            dependencies: [.product(name: "SharedDomain", package: "Core")]
        ),
        .target(
            name: "TasksData",
            dependencies: [
                "TasksDomain",
                .product(name: "SharedDomain", package: "Core"),
                .product(name: "Networking", package: "Core"),
            ]
        ),
        .target(
            name: "TasksPresentation",
            dependencies: [
                "TasksDomain",
                .product(name: "SharedDomain", package: "Core"),
                .product(name: "DesignSystem", package: "Core"),
                .product(name: "Factory", package: "Factory"),
            ],
            swiftSettings: mainActorByDefault
        ),
        .target(
            name: "TasksFeature",
            dependencies: [
                "TasksDomain",
                "TasksData",
                "TasksPresentation",
                .product(name: "Networking", package: "Core"),
                .product(name: "Factory", package: "Factory"),
            ],
            swiftSettings: mainActorByDefault
        ),
        .testTarget(
            name: "TasksDomainTests",
            dependencies: ["TasksDomain", .product(name: "SharedDomain", package: "Core")]
        ),
        .testTarget(
            name: "TasksDataTests",
            dependencies: [
                "TasksData",
                "TasksDomain",
                .product(name: "SharedDomain", package: "Core"),
                .product(name: "Networking", package: "Core"),
            ]
        ),
        .testTarget(
            name: "TasksPresentationTests",
            dependencies: [
                "TasksPresentation",
                "TasksDomain",
                .product(name: "SharedDomain", package: "Core"),
                .product(name: "Factory", package: "Factory"),
                .product(name: "FactoryTesting", package: "Factory"),
            ],
            swiftSettings: mainActorByDefault
        ),
    ],
    swiftLanguageModes: [.v6]
)
