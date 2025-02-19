import { UserPnlResponseDto } from '@/app/[locale]/leaderboard/types';
import { getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { matchSorter } from 'match-sorter';
import { useMemo, useState } from 'react';
import { useAccount } from 'wagmi';

import { cn } from '@/utils/styles';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import MockProgressBar from '@/app/[locale]/components/markets-table/mock-progress-bar';
import { columns } from '@/app/[locale]/leaderboard/components/body/tables/columns';

const TradingLeaderboard = ({
  filterString,
  pnlDeltas,
  isLoading,
}: {
  filterString: string;
  pnlDeltas: (UserPnlResponseDto & { rank: number })[] | null;
  isLoading: boolean;
}) => {
  const { address: yourAddress } = useAccount();

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'pnl',
      desc: true,
    },
  ]);

  const filteredData = useMemo(() => {
    return pnlDeltas
      ? matchSorter(pnlDeltas, filterString, {
          keys: ['user'],
        })
      : [];
  }, [pnlDeltas, filterString]);

  const table = useReactTable({
    data: filteredData,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    meta: {
      yourAddress,
    },
  });

  return (
    <Table
      containerClassName="min-w-full shadow flex-grow overflow-y-auto bg-secondary"
      className={cn('relative min-w-full bg-secondary')}>
      <TableHeader className="sticky top-0 bg-secondary border-b-2 border-b-black">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : typeof header.column.columnDef.header === 'function'
                    ? header.column.columnDef.header(header.getContext())
                    : header.column.columnDef.header}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isLoading && (
          <TableRow>
            <TableCell className="p-0 h-8" colSpan={7}>
              <MockProgressBar />
            </TableCell>
          </TableRow>
        )}
        {table.getRowModel().rows.map((row, _) => {
          return (
            <TableRow
              key={row.id}
              className={cn('hover:bg-muted/50 overflow-auto h-12', {
                'bg-accent/10 hover:bg-accent/50': row.original.rank === 1,
                'bg-[#C0C0C0]/10 hover:bg-[#C0C0C0]/50': row.original.rank === 2,
                'bg-[#CD7F32]/5 hover:bg-[#CD7F32]/40': row.original.rank === 3,
              })}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {typeof cell.column.columnDef.cell === 'function'
                    ? cell.column.columnDef.cell(cell.getContext())
                    : cell.getValue()}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TradingLeaderboard;
