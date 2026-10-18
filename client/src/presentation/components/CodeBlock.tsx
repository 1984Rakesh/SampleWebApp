import { useState } from 'react';
import { UiButton, UiPaper } from './ui';

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
      <pre style={{ padding: 16, overflow: 'auto', margin: 0 }}>
        <code className={`language-${language}`} style={{ fontSize: '0.875rem', color: '#F3F4F6' }}>
          {code}
        </code>
      </pre>
    </UiPaper>
  );
}
