import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import type { SxProps, Theme } from '@mui/material/styles';

const headerCellSx: SxProps<Theme> = {
  color: '#64748B',
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  borderColor: 'divider',
  whiteSpace: 'nowrap',
};

export function UiTableContainer({ children }: { children: React.ReactNode }) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      {children}
    </TableContainer>
  );
}

export function UiTable({ ariaLabel, children }: { ariaLabel?: string; children: React.ReactNode }) {
  return <Table aria-label={ariaLabel}>{children}</Table>;
}

export function UiTableHead({ children }: { children: React.ReactNode }) {
  return <TableHead>{children}</TableHead>;
}

export function UiTableBody({ children }: { children: React.ReactNode }) {
  return <TableBody>{children}</TableBody>;
}

interface UiTableRowProps {
  children: React.ReactNode;
  head?: boolean;
}

export function UiTableRow({ children, head = false }: UiTableRowProps) {
  return (
    <TableRow
      hover={!head}
      sx={
        head
          ? { bgcolor: 'rgba(148, 163, 184, 0.04)' }
          : { '&:last-child td': { borderBottom: 0 } }
      }
    >
      {children}
    </TableRow>
  );
}

interface UiTableCellProps {
  children: React.ReactNode;
  align?: 'left' | 'right';
  head?: boolean;
  muted?: boolean;
  strong?: boolean;
  nowrap?: boolean;
}

export function UiTableCell({
  children,
  align = 'left',
  head = false,
  muted = false,
  strong = false,
  nowrap = false,
}: UiTableCellProps) {
  if (head) {
    return (
      <TableCell align={align} sx={headerCellSx}>
        {children}
      </TableCell>
    );
  }

  return (
    <TableCell
      align={align}
      sx={{
        borderColor: 'divider',
        ...(muted && { color: 'text.secondary' }),
        ...(strong && { fontWeight: 500 }),
        ...(nowrap && { whiteSpace: 'nowrap' }),
      }}
    >
      {children}
    </TableCell>
  );
}

interface UiTablePaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  options?: number[];
}

export function UiTablePagination({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  options = [10, 25, 50],
}: UiTablePaginationProps) {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={(_event, nextPage) => onPageChange(nextPage)}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={(event) => onRowsPerPageChange(Number(event.target.value))}
      rowsPerPageOptions={options}
      labelRowsPerPage="Rows per page"
      sx={{
        mt: 1,
        overflow: 'hidden',
        color: 'text.secondary',
        '.MuiTablePagination-toolbar': { px: { xs: 0, sm: 2 }, minHeight: 52 },
        '.MuiTablePagination-selectLabel': { display: { xs: 'none', sm: 'block' } },
        '.MuiTablePagination-select': { display: { xs: 'none', sm: 'inline-flex' } },
        '.MuiTablePagination-spacer': { display: { xs: 'none', sm: 'block' } },
        '.MuiTablePagination-displayedRows': { ml: { xs: 'auto', sm: 0 } },
        '.MuiTablePagination-actions': { ml: { xs: 0.5, sm: 2.5 } },
      }}
    />
  );
}
