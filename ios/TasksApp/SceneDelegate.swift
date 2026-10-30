import AppComposition
import UIKit

/// Thin entry point: reads configuration and hands the window to `AppCoordinator` (ios §1).
final class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?
    private var coordinator: AppCoordinator?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }
        let config: AppConfig
        do {
            config = try AppConfig.load(from: Bundle.main.infoDictionary ?? [:])
        } catch {
            fatalError("Invalid build configuration: \(error)")
        }
        let window = UIWindow(windowScene: windowScene)
        let coordinator = AppCoordinator(window: window, config: config)
        coordinator.start()
        self.window = window
        self.coordinator = coordinator
    }
}
