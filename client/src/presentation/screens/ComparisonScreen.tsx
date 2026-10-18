import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useComparisonViewModel } from '../hooks';
import LayerMap from '../components/LayerMap';
import ComparisonPanel from '../components/ComparisonPanel';
import { UiCard, UiCardContent, UiCardHeader } from '../components/ui';

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
    <Box minHeight="100vh" bgcolor="background.default" p={{ xs: 2, md: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          iOS vs Web Architecture Comparison
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 4 }}>
            <LayerMap onLayerClick={selectLayer} selectedLayer={selectedLayer} />
          </Grid>

          <Grid size={{ xs: 12, lg: 8 }}>
            <UiCard sx={{ mb: 3 }}>
              <UiCardHeader title="Select Concept" />
              <UiCardContent>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {conceptNames.map((concept) => (
                    <Button
                      key={concept}
                      onClick={() => selectConcept(concept)}
                      variant={selectedConcept === concept ? 'contained' : 'outlined'}
                    >
                      {concept}
                    </Button>
                  ))}
                </Box>
              </UiCardContent>
            </UiCard>

            {selectedConceptData ? (
              <Box display="flex" flexDirection="column" gap={3}>
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
                      <Box component="ul" sx={{ pl: 2, m: 0 }}>
                        {selectedConceptData.learningNotes.map((note: string, index: number) => (
                          <Box component="li" key={index} sx={{ color: 'text.secondary', mb: 1 }}>
                            {note}
                          </Box>
                        ))}
                      </Box>
                    </UiCardContent>
                  </UiCard>
                )}
              </Box>
            ) : (
              <UiCard>
                <UiCardContent>
                  <Typography textAlign="center" color="text.secondary">
                    Select a concept above to see the comparison
                  </Typography>
                </UiCardContent>
              </UiCard>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
