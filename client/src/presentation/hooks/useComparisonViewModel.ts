import { useState } from 'react';

export interface ComparisonLayer {
  name: string;
  concepts: string[];
}

export interface ComparisonConcept {
  name: string;
  typescript: string;
  swift: string;
  explanation: string;
}

export function useComparisonViewModel() {
  const [selectedLayer, setSelectedLayer] = useState<string>('Foundation');
  const [selectedConcept, setSelectedConcept] = useState<string>('');

  const layers: ComparisonLayer[] = [
    {
      name: 'Foundation',
      concepts: ['Axios Client', 'AuthContext', 'ThemeContext', 'React Router', 'Route Guards'],
    },
    {
      name: 'Domain',
      concepts: ['Models', 'Use Cases', 'Enums', 'Validation'],
    },
    {
      name: 'Data',
      concepts: ['API Layer', 'Zod Schemas', 'Mappers', 'TanStack Query'],
    },
    {
      name: 'Presentation',
      concepts: ['Components', 'Hooks', 'Screens', 'Router Integration'],
    },
  ];

  const getConceptsForLayer = (layerName: string): string[] => {
    return layers.find((l) => l.name === layerName)?.concepts || [];
  };

  const selectLayer = (layerName: string) => {
    setSelectedLayer(layerName);
    // Reset concept selection when layer changes
    const concepts = getConceptsForLayer(layerName);
    setSelectedConcept(concepts[0] || '');
  };

  const selectConcept = (conceptName: string) => {
    setSelectedConcept(conceptName);
  };

  return {
    selectedLayer,
    selectedConcept,
    layers,
    selectLayer,
    selectConcept,
    getConceptsForLayer,
  };
}
