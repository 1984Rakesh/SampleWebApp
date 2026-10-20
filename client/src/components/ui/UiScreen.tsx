import UiContainer from './UiContainer';

interface UiScreenProps {
  children: React.ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl' | '5xl' | '6xl';
}

export default function UiScreen({ children, maxWidth = 'lg' }: UiScreenProps) {
  return (
    <div className="min-h-screen overflow-hidden bg-background px-4 py-4 md:px-8 md:pt-10 md:pb-16">
      <UiContainer maxWidth={maxWidth} disableGutters>
        {children}
      </UiContainer>
    </div>
  );
}
