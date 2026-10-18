import { useState } from 'react';
import { useComparisonViewModel } from '../hooks';
import LayerMap from '../components/LayerMap';
import ComparisonPanel from '../components/ComparisonPanel';

// Placeholder comparison data - will be implemented in Phase 10
const comparisonData: Record<string, any> = {
  Foundation: {
    'Axios Client': {
      typescript: `// Axios client singleton\nimport axios from 'axios';\n\nconst axiosClient = axios.create({\n  baseURL: API_BASE_URL,\n  timeout: 10000,\n});`,
      swift: `// URLSession configuration\nlet configuration = URLSessionConfiguration.default\nconfiguration.timeoutIntervalForRequest = 10\nlet session = URLSession(configuration: configuration)`,
      explanation: 'Both provide HTTP client configuration for network requests',
    },
    'AuthContext': {
      typescript: `// React Context for DI\nconst AuthContext = createContext();\nexport function AuthProvider({ children }) {\n  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>\n}`,
      swift: `// iOS Environment\n@EnvironmentObject var authManager: AuthManager\n\nstruct ContentView: View {\n  var body: some View {\n    Text("Logged in: \\(authManager.isAuthenticated)")\n  }\n}`,
      explanation: 'Both provide dependency injection for global state',
    },
  },
  Domain: {
    'Models': {
      typescript: `// Domain model (pure TypeScript)\ninterface User {\n  id: string;\n  name: string;\n  email: string;\n}`,
      swift: `// iOS Domain model (Swift struct)\nstruct User {\n  let id: String\n  let name: String\n  let email: String\n}`,
      explanation: 'Both define pure data structures without framework dependencies',
    },
    'Use Cases': {
      typescript: `// Use case (interactor)\nasync function getUserUseCase(userId: string): Promise<User> {\n  // Business logic\n}`,
      swift: `// iOS Interactor\nprotocol GetUserUseCaseProtocol {\n  func execute(userId: String) async throws -> User\n}`,
      explanation: 'Both encapsulate business logic in pure functions/classes',
    },
  },
  Data: {
    'Repository': {
      typescript: `// Repository pattern\nclass TaskRepository {\n  async getTasks(): Promise<Task[]> {\n    const dtos = await api.getTasks();\n    return dtos.map(toDomain);\n  }\n}`,
      swift: `// iOS Repository\nprotocol TaskRepositoryProtocol {\n  func fetchTasks() async throws -> [Task]\n}`,
      explanation: 'Both abstract data sources behind interfaces',
    },
  },
  Presentation: {
    'Hooks': {
      typescript: `// Custom hook (ViewModel)\nfunction useTaskViewModel() {\n  const { tasks, createTask } = useTaskRepository();\n  return { tasks, createTask };\n}`,
      swift: `// iOS ViewModel\nclass TaskViewModel: ObservableObject {\n  @Published var tasks: [Task] = []\n  func createTask() {}\n}`,
      explanation: 'Both provide view logic and state management',
    },
  },
};

export default function ComparisonScreen() {
  const { selectedLayer, selectedConcept, selectLayer, selectConcept, getConceptsForLayer } = useComparisonViewModel();
  const [selectedData, setSelectedData] = useState<any>(null);

  const concepts = getConceptsForLayer(selectedLayer);

  const handleLayerSelect = (layerName: string) => {
    selectLayer(layerName);
  };

  const handleConceptSelect = (conceptName: string) => {
    selectConcept(conceptName);
    setSelectedData(comparisonData[selectedLayer]?.[conceptName]);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          iOS vs Web Architecture Comparison
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Layer Map */}
          <div className="lg:col-span-1">
            <LayerMap onLayerClick={handleLayerSelect} selectedLayer={selectedLayer} />
          </div>

          {/* Comparison Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Concept Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Select Concept
              </h2>
              <div className="flex flex-wrap gap-2">
                {concepts.map((concept) => (
                  <button
                    key={concept}
                    onClick={() => handleConceptSelect(concept)}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      selectedConcept === concept
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {concept}
                  </button>
                ))}
              </div>
            </div>

            {/* Comparison Panel */}
            {selectedData ? (
              <ComparisonPanel
                layerName={selectedLayer}
                conceptName={selectedConcept}
                typescriptCode={selectedData.typescript}
                swiftCode={selectedData.swift}
                explanation={selectedData.explanation}
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center text-gray-600 dark:text-gray-400">
                Select a concept above to see the comparison
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
