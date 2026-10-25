import { cn } from './utils';

interface UiPressableProps {
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
}

export default function UiPressable({ children, onClick, selected = false }: UiPressableProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'block w-full rounded-lg p-2 text-left outline-offset-2 transition-colors',
        'focus-visible:ring-[3px] focus-visible:ring-ring/50',
        selected ? 'outline-2 outline-primary' : 'outline-none',
      )}
    >
      {children}
    </button>
  );
}
