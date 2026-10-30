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
    ],
    targets: [
        .target(
            name: "AppComposition",
            dependencies: [
                .product(name: "DesignSystem", package: "Core"),
            ],
            swiftSettings: mainActorByDefault
        ),
        .testTarget(
            name: "AppCompositionTests",
            dependencies: ["AppComposition"],
            swiftSettings: mainActorByDefault
        ),
    ],
    swiftLanguageModes: [.v6]
)
