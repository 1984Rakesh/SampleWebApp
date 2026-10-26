import { useState } from 'react';
import { Button } from '../../../components/ui';

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
    <div className="overflow-hidden rounded-md border border-border bg-muted text-foreground">
      {title && (
        <div className="border-b border-border bg-accent px-4 py-2 text-sm font-medium text-muted-foreground">{title}</div>
      )}
      <div className="relative">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="absolute top-2 right-2"
          aria-label={copied ? 'Code copied' : 'Copy code'}
          onClick={copyToClipboard}
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
        <pre className="overflow-x-auto p-4">
          <code className={`language-${language} text-sm`}>{code}</code>
        </pre>
      </div>
    </div>
  );
}
