interface UiAppBarProps {
  children: React.ReactNode;
}

export function UiAppBar({ children }: UiAppBarProps) {
  return <header className="bg-background border-b">{children}</header>;
}

interface UiToolbarProps {
  children: React.ReactNode;
}

export function UiToolbar({ children }: UiToolbarProps) {
  return (
    <div className="flex items-center gap-1 sm:gap-2 min-w-0 min-h-16 md:min-h-[72px] px-4 md:px-6">
      {children}
    </div>
  );
}
