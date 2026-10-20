import { UiCard, UiCardContent, UiCardHeader, UiChip, UiFlex, UiPressable, UiText, UiTonePanel } from '../../../components/ui';

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

export default function LayerMap({ onLayerClick, selectedLayer }: LayerMapProps) {
  return (
    <UiCard>
      <UiCardHeader title="Clean Architecture Layers" />
      <UiCardContent>
        <UiFlex column gap={1.5}>
          {layers.map((layer) => (
            <UiPressable
              key={layer.name}
              onClick={() => onLayerClick?.(layer.name)}
              selected={selectedLayer === layer.name}
            >
              <UiTonePanel tone={layer.tone} title={layer.name} description={layer.description} />
              <UiFlex wrap gap={0.5}>
                {layer.concepts.map((concept) => (
                  <UiChip key={concept} label={concept} variant="outline" />
                ))}
              </UiFlex>
            </UiPressable>
          ))}
        </UiFlex>

        <UiFlex column dividerTop>
          <UiText variant="subtitle2" weight="semibold" gutterBottom>
            Data Flow
          </UiText>
          <UiText variant="body2" tone="muted">
            → User interacts with a feature's Presentation layer
            <br />→ Presentation calls Domain use cases via feature-owned contexts
            <br />→ Use cases call Data repositories through domain contracts
            <br />→ Repositories call APIs and transform data
            <br />→ Foundation provides generic infrastructure services
            <br />→ App composes features and injects cross-feature capabilities
          </UiText>
        </UiFlex>
      </UiCardContent>
    </UiCard>
  );
}
