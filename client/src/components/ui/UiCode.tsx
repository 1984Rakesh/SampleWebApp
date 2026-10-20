interface UiCodeProps {
  code: string;
  language?: string;
}

// Scrollable code block body; pair with UiPaper for the framed surface.
export default function UiCode({ code, language = 'typescript' }: UiCodeProps) {
  return (
    <pre className="overflow-auto p-4">
      <code className={`language-${language} text-sm text-foreground`}>{code}</code>
    </pre>
  );
}
