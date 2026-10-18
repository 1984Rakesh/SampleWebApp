interface Layer {
  name: string;
  description: string;
  color: string;
  concepts: string[];
}

interface LayerMapProps {
  onLayerClick?: (layerName: string) => void;
  selectedLayer?: string;
}

const layers: Layer[] = [
  {
    name: 'Foundation',
    description: 'Network, Context, Router, DI',
    color: 'bg-blue-500',
    concepts: ['Axios Client', 'AuthContext', 'ThemeContext', 'React Router', 'Route Guards'],
  },
  {
    name: 'Domain',
    description: 'Pure Business Logic',
    color: 'bg-green-500',
    concepts: ['Models', 'Use Cases', 'Enums', 'Validation'],
  },
  {
    name: 'Data',
    description: 'Repositories, Mappers, APIs',
    color: 'bg-yellow-500',
    concepts: ['API Layer', 'Zod Schemas', 'Mappers', 'TanStack Query'],
  },
  {
    name: 'Presentation',
    description: 'UI Components & ViewModels',
    color: 'bg-purple-500',
    concepts: ['Components', 'Hooks', 'Screens', 'Router Integration'],
  },
];

export default function LayerMap({ onLayerClick, selectedLayer }: LayerMapProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Clean Architecture Layers
      </h3>

      <div className="space-y-3">
        {layers.map((layer) => (
          <button
            key={layer.name}
            onClick={() => onLayerClick?.(layer.name)}
            className={`w-full text-left p-4 rounded-lg transition-all ${
              selectedLayer === layer.name
                ? 'ring-2 ring-offset-2 ring-blue-500'
                : 'hover:shadow-md'
            }`}
          >
            <div className={`${layer.color} rounded-md p-3 mb-2`}>
              <h4 className="text-white font-semibold">{layer.name}</h4>
              <p className="text-white text-sm opacity-90">{layer.description}</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {layer.concepts.map((concept) => (
                <span
                  key={concept}
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                >
                  {concept}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Data Flow</h4>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <p>→ User interacts with Presentation layer</p>
          <p>→ Presentation layer calls Domain use cases</p>
          <p>→ Use cases call Data repositories</p>
          <p>→ Repositories call APIs and transform data</p>
          <p>→ Foundation provides infrastructure services</p>
        </div>
      </div>
    </div>
  );
}
