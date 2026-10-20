import { UiCard, UiCardContent, UiCardHeader, UiChip, UiFlex, UiPressable, UiText } from '../../../components/ui';

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
    description: 'foundation/: network, session storage, theme',
    color: '#3b82f6',
    concepts: ['Axios Client', 'AuthContext', 'ThemeContext', 'React Router', 'Route Guards'],
  },
  {
    name: 'Domain',
    description: 'Pure business logic inside each feature',
    color: '#22c55e',
    concepts: ['Models', 'Use Cases', 'Enums', 'Validation'],
  },
  {
    name: 'Data',
    description: 'Per-feature repositories, mappers, APIs',
    color: '#eab308',
    concepts: ['API Layer', 'Zod Schemas', 'Mappers', 'TanStack Query'],
  },
  {
    name: 'Presentation',
    description: 'Feature components, contexts & ViewModels',
    color: '#a855f7',
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
              <UiFlex column bgColor={layer.color} rounded p={1.5} mb={1}>
                <UiText variant="subtitle1" weight="semibold" tone="light">
                  {layer.name}
                </UiText>
                <UiText variant="body2" tone="lightMuted">
                  {layer.description}
                </UiText>
              </UiFlex>
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
