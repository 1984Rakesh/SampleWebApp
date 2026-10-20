import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { Card } from './card';
import { Button } from './button';
import { cn } from '@/lib/utils';

export function UiTableContainer({ children }: { children: React.ReactNode }) {
  return <Card className="gap-0 py-0 overflow-hidden">{children}</Card>;
}

export function UiTable({ ariaLabel, fixed = false, children }: { ariaLabel?: string; fixed?: boolean; children: React.ReactNode }) {
  return (
    <Table aria-label={ariaLabel} className={cn('min-w-[860px]', fixed && 'table-fixed')}>
      {children}
    </Table>
  );
}

export function UiTableHead({ children }: { children: React.ReactNode }) {
  return <TableHeader className="bg-muted/50">{children}</TableHeader>;
}

export function UiTableBody({ children }: { children: React.ReactNode }) {
  return <TableBody>{children}</TableBody>;
}

interface UiTableRowProps {
  children: React.ReactNode;
  head?: boolean;
}

export function UiTableRow({ children, head = false }: UiTableRowProps) {
  return <TableRow className={head ? 'hover:bg-transparent' : undefined}>{children}</TableRow>;
}

type UiTableColumnWidth = 'checkbox' | 'meta' | 'actions';
type UiTableEdge = 'start' | 'end';

interface UiTableCellProps {
  children: React.ReactNode;
  align?: 'left' | 'right';
  head?: boolean;
  width?: UiTableColumnWidth;
  edge?: UiTableEdge;
  hideLabel?: boolean;
  muted?: boolean;
  strong?: boolean;
  nowrap?: boolean;
  roomy?: boolean;
}

const columnWidthMap: Record<UiTableColumnWidth, string> = {
  checkbox: 'w-12',
  meta: 'w-32',
  actions: 'w-24',
};

const edgePaddingMap: Record<UiTableEdge, string> = {
  start: 'pl-4',
  end: 'pr-4',
};

export function UiTableCell({
  children,
  align = 'left',
  head = false,
  width,
  edge,
  hideLabel = false,
  muted = false,
  strong = false,
  nowrap = false,
  roomy = false,
}: UiTableCellProps) {
  if (head) {
    return (
      <TableHead
        className={cn(
          width && columnWidthMap[width],
          edge && edgePaddingMap[edge],
          align === 'right' && 'text-right',
        )}
      >
        {hideLabel ? <span className="sr-only">{children}</span> : children}
      </TableHead>
    );
  }

  return (
    <TableCell
      className={cn(
        roomy && 'py-3',
        edge && edgePaddingMap[edge],
        align === 'right' && 'text-right',
        muted && 'text-muted-foreground',
        strong && 'font-medium',
        nowrap && 'whitespace-nowrap',
      )}
    >
      {children}
    </TableCell>
  );
}

export function UiTableFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-t px-6 py-3 text-sm text-muted-foreground">
      {children}
    </div>
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
  const lastPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1);
  const from = count === 0 ? 0 : page * rowsPerPage + 1;
  const to = Math.min(count, (page + 1) * rowsPerPage);

  return (
    <div className="mt-2 flex items-center justify-between gap-2 text-sm text-muted-foreground">
      <label className="hidden items-center gap-2 sm:flex">
        Rows per page
        <select
          className="h-8 rounded-md border border-input bg-transparent px-2 text-foreground"
          value={rowsPerPage}
          onChange={(event) => onRowsPerPageChange(Number(event.target.value))}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <span className="ml-auto tabular-nums sm:ml-0">
        {from}–{to} of {count}
      </span>
      <div className="flex items-center">
        <Button variant="ghost" size="icon-sm" aria-label="Previous page" disabled={page <= 0} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft className="size-4" />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Next page" disabled={page >= lastPage} onClick={() => onPageChange(page + 1)}>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
