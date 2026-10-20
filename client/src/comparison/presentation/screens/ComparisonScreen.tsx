import { useComparisonViewModel } from '../hooks';
import LayerMap from '../components/LayerMap';
import ComparisonPanel from '../components/ComparisonPanel';
import {
  UiButton,
  UiCard,
  UiCardContent,
  UiCardHeader,
  UiFlex,
  UiGrid,
  UiGridItem,
  UiScreen,
  UiText,
} from '../../../components/ui';

export default function ComparisonScreen() {
  const {
    selectedLayer,
    selectedConcept,
    conceptNames,
    selectedConceptData,
    selectLayer,
    selectConcept,
  } = useComparisonViewModel();

  return (
    <UiScreen maxWidth="lg">
      <UiText variant="h4" as="h1" weight="bold" gutterBottom>
        iOS vs Web Architecture Comparison
      </UiText>

      <UiGrid spacing={3}>
        <UiGridItem lg={4}>
          <LayerMap onLayerClick={selectLayer} selectedLayer={selectedLayer} />
        </UiGridItem>

        <UiGridItem lg={8}>
          <UiCard spaced>
            <UiCardHeader title="Select Concept" />
            <UiCardContent>
              <UiFlex wrap gap={1}>
                {conceptNames.map((concept) => (
                  <UiButton
                    key={concept}
                    onClick={() => selectConcept(concept)}
                    variant={selectedConcept === concept ? 'solid' : 'outline'}
                  >
                    {concept}
                  </UiButton>
                ))}
              </UiFlex>
            </UiCardContent>
          </UiCard>

          {selectedConceptData ? (
            <UiFlex column gap={3}>
              <ComparisonPanel
                layerName={selectedLayer}
                conceptName={selectedConcept}
                typescriptCode={selectedConceptData.typescript}
                swiftCode={selectedConceptData.swift}
                explanation={selectedConceptData.explanation}
              />
              {selectedConceptData.learningNotes && selectedConceptData.learningNotes.length > 0 && (
                <UiCard>
                  <UiCardHeader title="Learning Notes" />
                  <UiCardContent>
                    <ul style={{ paddingLeft: 16, margin: 0 }}>
                      {selectedConceptData.learningNotes.map((note: string, index: number) => (
                        <UiText as="li" key={index} tone="muted" mb={1}>
                          {note}
                        </UiText>
                      ))}
                    </ul>
                  </UiCardContent>
                </UiCard>
              )}
            </UiFlex>
          ) : (
            <UiCard>
              <UiCardContent>
                <UiText align="center" tone="muted">
                  Select a concept above to see the comparison
                </UiText>
              </UiCardContent>
            </UiCard>
          )}
        </UiGridItem>
      </UiGrid>
    </UiScreen>
  );
}
