import { Loader2 } from 'lucide-react';

interface UiCircularProgressProps {
  text?: string;
  size?: number;
}

export default function UiCircularProgress({ text, size = 40 }: UiCircularProgressProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader2
        className="animate-spin text-primary"
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
      {text && <p className="text-muted-foreground">{text}</p>}
    </div>
  );
}
