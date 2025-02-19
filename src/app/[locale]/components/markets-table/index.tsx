'use client';

import { getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { matchSorter } from 'match-sorter';
import React, { useEffect } from 'react';

import { cn } from '@/utils/styles';

import { useRouter } from '@/navigation';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import useMarketsData from '../../hooks/useMarketsData';

import { SUPPORTED_CHAIN_IDS } from '@/consts/chains';

import { marketColumns } from './columns';
import MockProgressBar from './mock-progress-bar';

export const MarketTable = ({
  columnsToRender,
  classNames,
  filterString = '',
  keyboardNavigation,
}: {
  columnsToRender?: string[];
  classNames?: { table?: string; tableBody?: string };
  filterString?: string;
  keyboardNavigation?: { selectedIndex: number; onRowCountChange: (count: number) => void };
}) => {
  const { data, error, isError, refetch, isLoading } = useMarketsData({ chainIds: [...SUPPORTED_CHAIN_IDS] });
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: 'liquidity',
      desc: true, // sort by openInterest in descending order by default
    },
  ]);
  const router = useRouter();

  const { selectedIndex = -1, onRowCountChange } = keyboardNavigation || {};

  const filteredData = React.useMemo(() => {
    return data
      ? matchSorter(data, filterString, {
          keys: ['pairLabel', 'chainName'],
        })
      : [];
  }, [data, filterString]);

  const table = useReactTable({
    data: filteredData,
    columns: columnsToRender?.length
      ? //@ts-ignore
        // todo: fix type
        marketColumns.filter((column) => columnsToRender.includes(column.accessorKey))
      : marketColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  useEffect(() => {
    onRowCountChange?.(filteredData.length);
  }, [filteredData, onRowCountChange]);

  return (
    <Table
      containerClassName="min-w-full shadow mt-[1px] flex-grow overflow-y-auto"
      className={cn('min-w-full bg-secondary', classNames?.table)}>
      <TableHeader>
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

      <TableBody className={classNames?.tableBody}>
        {isLoading && (
          <TableRow>
            <TableCell className="p-0" colSpan={7}>
              <MockProgressBar />
            </TableCell>
          </TableRow>
        )}
        {table.getRowModel().rows.map((row, index) => {
          const isSelected = index === selectedIndex;
          return (
            <TableRow
              key={row.id}
              className={cn('hover:bg-muted/50', isSelected && 'bg-muted/50')}
              role="button"
              onClick={() => router.push(`/trade/${row.original.chainName}/${row.original.pairLabel}`)}
              data-row-index={index}
              data-chain-name={row.original.chainName}
              data-pair-label={row.original.pairLabel}>
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
