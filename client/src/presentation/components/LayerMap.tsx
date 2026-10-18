import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { UiCard, UiCardContent, UiCardHeader } from './ui';

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
    color: '#3b82f6',
    concepts: ['Axios Client', 'AuthContext', 'ThemeContext', 'React Router', 'Route Guards'],
  },
  {
    name: 'Domain',
    description: 'Pure Business Logic',
    color: '#22c55e',
    concepts: ['Models', 'Use Cases', 'Enums', 'Validation'],
  },
  {
    name: 'Data',
    description: 'Repositories, Mappers, APIs',
    color: '#eab308',
    concepts: ['API Layer', 'Zod Schemas', 'Mappers', 'TanStack Query'],
  },
  {
    name: 'Presentation',
    description: 'UI Components & ViewModels',
    color: '#a855f7',
    concepts: ['Components', 'Hooks', 'Screens', 'Router Integration'],
  },
];

export default function LayerMap({ onLayerClick, selectedLayer }: LayerMapProps) {
  return (
    <UiCard>
      <UiCardHeader title="Clean Architecture Layers" />
      <UiCardContent>
        <Box display="flex" flexDirection="column" gap={1.5}>
          {layers.map((layer) => (
            <ButtonBase
              key={layer.name}
              onClick={() => onLayerClick?.(layer.name)}
              sx={{
                width: '100%',
                textAlign: 'left',
                borderRadius: 2,
                p: 1,
                display: 'block',
                outline:
                  selectedLayer === layer.name ? '2px solid' : 'none',
                outlineColor: 'primary.main',
                outlineOffset: 2,
              }}
            >
              <Box sx={{ bgcolor: layer.color, borderRadius: 1, p: 1.5, mb: 1 }}>
                <Typography variant="subtitle1" fontWeight={600} color="#fff">
                  {layer.name}
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.9)">
                  {layer.description}
                </Typography>
              </Box>
              <Box display="flex" flexWrap="wrap" gap={0.5}>
                {layer.concepts.map((concept) => (
                  <Chip key={concept} label={concept} size="small" variant="outlined" />
                ))}
              </Box>
            </ButtonBase>
          ))}
        </Box>

        <Box mt={3} pt={3} borderTop={1} borderColor="divider">
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Data Flow
          </Typography>
          <Typography variant="body2" color="text.secondary">
            → User interacts with Presentation layer
            <br />→ Presentation layer calls Domain use cases
            <br />→ Use cases call Data repositories
            <br />→ Repositories call APIs and transform data
            <br />→ Foundation provides infrastructure services
          </Typography>
        </Box>
      </UiCardContent>
    </UiCard>
  );
}
