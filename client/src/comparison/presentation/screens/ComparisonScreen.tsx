import { useComparisonViewModel } from '../hooks';
import { ComparisonPanel, LayerMap } from '../components';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../../../components/ui';

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
    <main className="min-h-screen bg-background px-4 py-4 md:px-8 md:pt-10 md:pb-16">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6">
        <h1 className="font-display text-[42px] leading-[46px] font-bold tracking-tight">iOS vs web architecture comparison</h1>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-4">
            <LayerMap onLayerClick={selectLayer} selectedLayer={selectedLayer} />
          </div>

          <div className="flex min-w-0 flex-col gap-6 lg:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-[22px] leading-7 tracking-tight">Select concept</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {conceptNames.map((concept) => (
                    <Button
                      key={concept}
                      type="button"
                      variant={selectedConcept === concept ? 'default' : 'outline'}
                      aria-pressed={selectedConcept === concept}
                      onClick={() => selectConcept(concept)}
                    >
                      {concept}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedConceptData ? (
              <>
                <ComparisonPanel
                  layerName={selectedLayer}
                  conceptName={selectedConcept}
                  typescriptCode={selectedConceptData.typescript}
                  swiftCode={selectedConceptData.swift}
                  explanation={selectedConceptData.explanation}
                />
                {selectedConceptData.learningNotes && selectedConceptData.learningNotes.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[22px] leading-7 tracking-tight">Learning notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="m-0 flex list-disc flex-col gap-2 pl-4 text-muted-foreground">
                        {selectedConceptData.learningNotes.map((note: string, index: number) => (
                          <li key={index}>{note}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent>
                  <p className="text-center text-muted-foreground">Select a concept above to see the comparison</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
