import { useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import CodeBlock from './CodeBlock';
import { UiCard, UiCardContent, UiCardHeader } from './ui';

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

  const handleChange = (_event: React.MouseEvent<HTMLElement>, value: 'typescript' | 'swift' | null) => {
    if (value) {
      setActiveView(value);
    }
  };

  return (
    <UiCard>
      <UiCardHeader title={conceptName} subheader={`Layer: ${layerName}`} />
      <UiCardContent>
        {explanation && (
          <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
            {explanation}
          </Typography>
        )}

        <ToggleButtonGroup
          value={activeView}
          exclusive
          fullWidth
          onChange={handleChange}
          sx={{ mb: 2 }}
        >
          <ToggleButton value="typescript">TypeScript (Web)</ToggleButton>
          <ToggleButton value="swift">Swift (iOS)</ToggleButton>
        </ToggleButtonGroup>

        {activeView === 'typescript' ? (
          <CodeBlock code={typescriptCode} language="typescript" title="TypeScript Implementation" />
        ) : (
          <CodeBlock code={swiftCode} language="swift" title="Swift Implementation" />
        )}
      </UiCardContent>
    </UiCard>
  );
}
