// swift-tools-version: 6.2
import PackageDescription

// App composition owns UIKit coordinators and the shell, so it defaults to the main actor (ios §2.4).
let mainActorByDefault: [SwiftSetting] = [
    .defaultIsolation(MainActor.self),
    .enableUpcomingFeature("InferIsolatedConformances"),
]

let package = Package(
    name: "AppComposition",
    platforms: [.iOS(.v17)],
    products: [
        .library(name: "AppComposition", targets: ["AppComposition"]),
    ],
    dependencies: [
        .package(path: "../Core"),
        .package(path: "../Features/Auth"),
        .package(path: "../Features/Tasks"),
        .package(path: "../Features/Dashboard"),
        .package(path: "../Features/Profile"),
    ],
    targets: [
        .target(
            name: "AppComposition",
            dependencies: [
                .product(name: "DesignSystem", package: "Core"),
                .product(name: "Networking", package: "Core"),
                .product(name: "AuthFeature", package: "Auth"),
                .product(name: "TasksFeature", package: "Tasks"),
                .product(name: "DashboardFeature", package: "Dashboard"),
                .product(name: "ProfileFeature", package: "Profile"),
            ],
            swiftSettings: mainActorByDefault
        ),
        .testTarget(
            name: "AppCompositionTests",
            dependencies: [
                "AppComposition",
                .product(name: "AuthFeature", package: "Auth"),
                .product(name: "TasksFeature", package: "Tasks"),
                .product(name: "DashboardFeature", package: "Dashboard"),
                .product(name: "ProfileFeature", package: "Profile"),
            ],
            swiftSettings: mainActorByDefault
        ),
    ],
    swiftLanguageModes: [.v6]
)
