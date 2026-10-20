import { useId } from 'react';
import { Search } from 'lucide-react';
import { Input } from './input';
import { Label } from './label';

interface UiSearchFieldProps { id?: string; value: string; onChange: (value: string) => void; placeholder: string; expand?: boolean }

export default function UiSearchField({ id, value, onChange, placeholder, expand = false }: UiSearchFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className={expand ? 'relative min-w-64 flex-1' : 'relative w-full'}>
      <Label htmlFor={inputId} className="sr-only">{placeholder}</Label>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <Input
        id={inputId}
        className="h-9 pl-9"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  );
}
