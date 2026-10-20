import { useState } from 'react';
import CodeBlock from './CodeBlock';
import { UiCard, UiCardContent, UiCardHeader, UiText, UiToggleGroup } from '../../../components/ui';

const viewOptions = [
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
  const [activeView, setActiveView] = useState<'typescript' | 'swift'>('typescript');

  return (
    <UiCard>
      <UiCardHeader title={conceptName} subtitle={`Layer: ${layerName}`} />
      <UiCardContent>
        {explanation && (
          <UiText tone="muted" variant="body2" gutterBottom>
            {explanation}
          </UiText>
        )}

        <UiToggleGroup
          value={activeView}
          options={viewOptions}
          onChange={(value) => setActiveView(value as 'typescript' | 'swift')}
          fullWidth
          gutterBottom
        />

        {activeView === 'typescript' ? (
          <CodeBlock code={typescriptCode} language="typescript" title="TypeScript Implementation" />
        ) : (
          <CodeBlock code={swiftCode} language="swift" title="Swift Implementation" />
        )}
      </UiCardContent>
    </UiCard>
  );
}
