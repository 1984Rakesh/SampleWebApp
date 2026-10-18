import Grid from '@mui/material/Grid2';

interface UiGridProps {
  children: React.ReactNode;
  spacing?: number;
  mb?: number;
}

export function UiGrid({ children, spacing = 3, mb }: UiGridProps) {
  return (
    <Grid container spacing={spacing} mb={mb}>
      {children}
    </Grid>
  );
}

interface UiGridItemProps {
  children: React.ReactNode;
  md?: number;
  lg?: number;
}

export function UiGridItem({ children, md, lg }: UiGridItemProps) {
  return <Grid size={{ xs: 12, ...(md && { md }), ...(lg && { lg }) }}>{children}</Grid>;
}
