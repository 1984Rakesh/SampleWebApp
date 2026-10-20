import { useState } from 'react';
import { comparisonData } from '../models/comparisonData';

const firstConceptOf = (layerName: string) =>
  Object.keys(comparisonData[layerName]?.concepts ?? {})[0] ?? '';

export function useComparisonViewModel() {
  const [selectedLayer, setSelectedLayer] = useState<string>('Foundation');
  const [selectedConcept, setSelectedConcept] = useState<string>('');

  const conceptNames = Object.keys(comparisonData[selectedLayer]?.concepts ?? {});
  const selectedConceptData = comparisonData[selectedLayer]?.concepts?.[selectedConcept];

  const selectLayer = (layerName: string) => {
    setSelectedLayer(layerName);
    setSelectedConcept(firstConceptOf(layerName));
  };

  const selectConcept = (conceptName: string) => {
    setSelectedConcept(conceptName);
  };

  return {
    selectedLayer,
    selectedConcept,
    conceptNames,
    selectedConceptData,
    selectLayer,
    selectConcept,
  };
}
