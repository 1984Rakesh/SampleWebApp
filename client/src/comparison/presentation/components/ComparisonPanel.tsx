import { useState } from 'react';
import CodeBlock from './CodeBlock';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, ToggleGroup, ToggleGroupItem } from '../../../components/ui';

type CodeView = 'typescript' | 'swift';

const viewOptions: { value: CodeView; label: string }[] = [
  { value: 'typescript', label: 'TypeScript (Web)' },
  { value: 'swift', label: 'Swift (iOS)' },
];

interface ComparisonPanelProps {
  layerName: string;
  conceptName: string;
  typescriptCode: string;
  swiftCode: string;
  explanation?: string;
}

export default function ComparisonPanel({
  layerName,
  conceptName,
  typescriptCode,
  swiftCode,
  explanation,
}: ComparisonPanelProps) {
  const [activeView, setActiveView] = useState<CodeView>('typescript');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[22px] leading-7 tracking-tight">{conceptName}</CardTitle>
        <CardDescription>Layer: {layerName}</CardDescription>
      </CardHeader>
      <CardContent>
        {explanation && <p className="mb-2 text-sm text-muted-foreground">{explanation}</p>}

        <ToggleGroup
          type="single"
          aria-label="Code language"
          className="mb-4 w-full"
          value={activeView}
          onValueChange={(value) => value && setActiveView(value as CodeView)}
        >
          {viewOptions.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value} className="flex-1">
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        {activeView === 'typescript' ? (
          <CodeBlock code={typescriptCode} language="typescript" title="TypeScript Implementation" />
        ) : (
          <CodeBlock code={swiftCode} language="swift" title="Swift Implementation" />
        )}
      </CardContent>
    </Card>
  );
}
