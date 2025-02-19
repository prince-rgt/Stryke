import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useMeasure, useWindowSize } from 'react-use';
import { useAccount } from 'wagmi';

import { cn } from '@/utils/styles';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Typography } from '@/components/ui/typography';
import MockProgressBar from '@/app/[locale]/components/markets-table/mock-progress-bar';
import { columns } from '@/app/[locale]/trade/[[...market]]/components/trading-details/trade-history/columns';
import useCoalescedHistory from '@/app/[locale]/trade/[[...market]]/components/trading-details/trade-history/hooks/useCoalescedHistory';

import useStrikesStore from '@/app/[locale]/trade/[[...market]]/hooks/store/useStrikesStore';

import { DEFAULT_CHAIN_ID } from '@/consts/chains';

import { ActionFilter, PeriodFilter } from './filters';

const TradeHistory = () => {
  const [_, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [actionTypes, setActionTypes] = useState<Record<string, boolean>>({
    purchase: true,
    exercise: true,
    deposit: true,
    withdraw: true,
    expired: true,
  });

  const { address: user = '0x', chainId = DEFAULT_CHAIN_ID } = useAccount();
  const { height: windowHeight } = useWindowSize();
  const [ref, { width: tableWidth }] = useMeasure();

  const { isChartCollapsed } = useStrikesStore();

  const height = windowHeight - 36.5 - 1 - (isChartCollapsed ? 1 : 300) - 1 - 32 - 1 - 48.5 - 48.5 - 46.5 - 2;

  const { data, isLoading } = useCoalescedHistory({
    chainId,
    user,
  });

  const table = useReactTable({
    data,
    columns: columns.map((column) => ({ ...column, size: tableWidth / 6 })),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    enableSorting: true,
    state: {
      columnFilters,
    },
    initialState: {
      sorting: [
        {
          id: 'timestamp',
          desc: true,
        },
      ],
    },
  });

  useEffect(() => {
    setColumnFilters([
      {
        id: 'action',
        value: Object.keys(actionTypes)
          .map((action) => {
            if (actionTypes[action]) return action;
          })
          .filter((i) => i),
      },
    ]);
  }, [actionTypes]);

  return (
    <div className={`flex flex-col items-center justify-center bg-secondary p-md`}>
      <div className="flex w-full mb-4 space-x-4">
        <PeriodFilter className="self-start" />
        <ActionFilter actionVisibility={actionTypes} setActionVisibility={setActionTypes} />
      </div>
      {!isLoading && data.length === 0 ? (
        <Typography>Your trade history will appear here</Typography>
      ) : (
        <Table
          //@ts-ignore
          ref={ref}
          style={{ height }}>
          <TableHeader className="block">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: `${header.getSize()}px` }}>
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
          <TableBody className="block overflow-auto" style={{ height }}>
            {isLoading ? (
              <TableRow>
                <TableCell style={{ width: tableWidth }} className="p-0" colSpan={6}>
                  <MockProgressBar />
                </TableCell>
              </TableRow>
            ) : null}
            {table.getRowModel().rows.map((row) => {
              return (
                <TableRow className={cn({ 'bg-selected': row.getIsSelected() })} key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell style={{ width: `${cell.column.getSize()}px` }} key={cell.id}>
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
      )}
    </div>
  );
};

export default TradeHistory;
