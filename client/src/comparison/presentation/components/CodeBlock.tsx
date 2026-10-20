import { useState } from 'react';
import { UiButton, UiCode, UiPaper } from '../../../components/ui';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export default function CodeBlock({ code, language = 'typescript', title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <UiPaper
      tone="dark"
      title={title}
      action={
        <UiButton
          variant="solid"
          tone="muted"
          size="sm"
          onClick={copyToClipboard}
          ariaLabel="Copy code"
        >
          {copied ? 'Copied!' : 'Copy'}
        </UiButton>
      }
    >
      <UiCode code={code} language={language} />
    </UiPaper>
  );
}
