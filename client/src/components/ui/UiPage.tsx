interface UiPageProps {
  children: React.ReactNode;
}

export default function UiPage({ children }: UiPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {children}
    </div>
  );
}
