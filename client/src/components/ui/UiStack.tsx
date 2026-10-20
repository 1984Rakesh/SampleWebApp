import Stack from '@mui/material/Stack';

type Breakpoint = 'sm' | 'md' | 'lg';

interface UiStackProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  rowFrom?: Breakpoint;
  spacing?: number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  wrap?: boolean;
  mt?: number;
  mb?: number;
}

const alignMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
} as const;

export default function UiStack({
  children,
  direction = 'column',
  rowFrom,
  spacing = 2,
  align,
  wrap = false,
  mt,
  mb,
}: UiStackProps) {
  return (
    <Stack
      direction={rowFrom ? { xs: 'column', [rowFrom]: 'row' } : direction}
      spacing={spacing}
      alignItems={
        rowFrom
          ? { xs: 'stretch', [rowFrom]: align ? alignMap[align] : 'stretch' }
          : align
            ? alignMap[align]
            : undefined
      }
      flexWrap={wrap ? 'wrap' : undefined}
      useFlexGap={wrap || undefined}
      mt={mt}
      mb={mb}
    >
      {children}
    </Stack>
  );
}
