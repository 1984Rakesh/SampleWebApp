import { useState } from 'react';
import { useComparisonViewModel } from '../hooks';
import LayerMap from '../components/LayerMap';
import ComparisonPanel from '../components/ComparisonPanel';
import { comparisonData } from '../../data/comparisonData';

export default function ComparisonScreen() {
  const { selectedLayer, selectedConcept, selectLayer, selectConcept, getConceptsForLayer } = useComparisonViewModel();
  const [selectedData, setSelectedData] = useState<any>(null);

  const concepts = getConceptsForLayer(selectedLayer);

  const handleLayerSelect = (layerName: string) => {
    selectLayer(layerName);
    // Reset concept selection when layer changes
    const layerConcepts = comparisonData[layerName]?.concepts || {};
    const firstConcept = Object.keys(layerConcepts)[0];
    if (firstConcept) {
      selectConcept(firstConcept);
      setSelectedData(layerConcepts[firstConcept]);
    }
  };

  const handleConceptSelect = (conceptName: string) => {
    selectConcept(conceptName);
    setSelectedData(comparisonData[selectedLayer]?.concepts?.[conceptName]);
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
              <div className="space-y-6">
                <ComparisonPanel
                  layerName={selectedLayer}
                  conceptName={selectedConcept}
                  typescriptCode={selectedData.typescript}
                  swiftCode={selectedData.swift}
                  explanation={selectedData.explanation}
                />
                {selectedData.learningNotes && selectedData.learningNotes.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Learning Notes
                    </h3>
                    <ul className="space-y-2">
                      {selectedData.learningNotes.map((note: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                          <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
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
