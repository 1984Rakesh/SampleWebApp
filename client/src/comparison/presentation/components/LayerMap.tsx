import { Badge, Card, CardContent, CardHeader, CardTitle, cn } from '../../../components/ui';

type LayerTone = 'status-progress' | 'status-done' | 'priority-medium' | 'priority-low';

interface Layer {
  name: string;
  description: string;
  tone: LayerTone;
  concepts: string[];
}

interface LayerMapProps {
  onLayerClick?: (layerName: string) => void;
  selectedLayer?: string;
}

const layers: Layer[] = [
  {
    name: 'Foundation',
    description: 'foundation/: network, session storage, theme',
    tone: 'status-progress',
    concepts: ['Axios Client', 'AuthContext', 'ThemeContext', 'React Router', 'Route Guards'],
  },
  {
    name: 'Domain',
    description: 'Pure business logic inside each feature',
    tone: 'status-done',
    concepts: ['Models', 'Use Cases', 'Enums', 'Validation'],
  },
  {
    name: 'Data',
    description: 'Per-feature repositories, mappers, APIs',
    tone: 'priority-medium',
    concepts: ['API Layer', 'Zod Schemas', 'Mappers', 'TanStack Query'],
  },
  {
    name: 'Presentation',
    description: 'Feature components, contexts & ViewModels',
    tone: 'priority-low',
    concepts: ['Components', 'Hooks', 'Screens', 'Router Integration'],
  },
];

const toneClasses: Record<LayerTone, string> = {
  'status-progress': 'bg-status-progress text-status-progress-foreground',
  'status-done': 'bg-status-done text-status-done-foreground',
  'priority-medium': 'bg-priority-medium text-priority-medium-foreground',
  'priority-low': 'bg-priority-low text-priority-low-foreground',
};

export default function LayerMap({ onLayerClick, selectedLayer }: LayerMapProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[22px] leading-7 tracking-tight">Clean architecture layers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {layers.map((layer) => (
            <button
              key={layer.name}
              type="button"
              aria-pressed={selectedLayer === layer.name}
              onClick={() => onLayerClick?.(layer.name)}
              className={cn(
                'block w-full rounded-lg p-2 text-left outline-offset-2 transition-colors focus-visible:ring-2 focus-visible:ring-ring',
                selectedLayer === layer.name ? 'outline-2 outline-primary' : 'outline-none',
              )}
            >
              <div className={cn('mb-2 flex flex-col rounded-md p-3', toneClasses[layer.tone])}>
                <span className="font-semibold">{layer.name}</span>
                <span className="text-sm">{layer.description}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {layer.concepts.map((concept) => (
                  <Badge key={concept} variant="outline">
                    {concept}
                  </Badge>
                ))}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col border-t border-divider pt-6">
          <h3 className="mb-1.5 text-sm font-semibold">Data flow</h3>
          <p className="text-sm text-muted-foreground">
            → User interacts with a feature's Presentation layer
            <br />→ Presentation calls Domain use cases via feature-owned contexts
            <br />→ Use cases call Data repositories through domain contracts
            <br />→ Repositories call APIs and transform data
            <br />→ Foundation provides generic infrastructure services
            <br />→ App composes features and injects cross-feature capabilities
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
