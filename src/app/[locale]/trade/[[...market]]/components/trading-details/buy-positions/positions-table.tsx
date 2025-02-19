'use client';

import { getCoreRowModel, OnChangeFn, RowSelectionState, useReactTable } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { useMeasure, useWindowSize } from 'react-use';

import { cn } from '@/utils/styles';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Typography } from '@/components/ui/typography';
import MockProgressBar from '@/app/[locale]/components/markets-table/mock-progress-bar';

import useStrikesStore from '../../../hooks/store/useStrikesStore';
import { BuyPositionType } from './hooks/useBuyPositionsData';

import { columns } from './columns';

export const BuyPositionsTable = ({
  positions,
  selectedPositions,
  onRowSelectionChange,
  showNonExercisablePositionToast,
  refetchBuyPositions,
  isLoading,
}: {
  positions: BuyPositionType[];
  isLoading: boolean;
  selectedPositions: {};
  refetchBuyPositions: () => void;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  showNonExercisablePositionToast: () => void;
}) => {
  const { isChartCollapsed, displayStrikesAsMarketCap, selectedMarket } = useStrikesStore();
  const { isLimitOrdersEnabled } = selectedMarket;

  const { height: windowHeight } = useWindowSize();
  const [ref, { width: tableWidth }] = useMeasure();

  // todo: way too hacky, but couldn't find a better cuz table is messing things up
  // find a better way to do this
  const height = windowHeight - 36.5 - 1 - 40 - 1 - (isChartCollapsed ? 1 : 300) - 1 - 32 - 1 - 48.5 - 48.5 - 2;

  const table = useReactTable({
    data: positions,
    columns: columns.map((column, i) => ({
      ...column,
      size: i === 0 ? tableWidth / 4 : tableWidth / (!isLimitOrdersEnabled ? 7 : 8),
    })),
    meta: {
      displayStrikesAsMarketCap,
      refetchBuyPositions,
      showNonExercisablePositionToast,
    },
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange,
    state: {
      rowSelection: selectedPositions,
      columnVisibility: {
        limitExercise: isLimitOrdersEnabled,
      },
    },
    getRowId: (row) => String(row.meta.tokenId),
  });

  return !isLoading && positions.length === 0 ? (
    <div className="flex w-full items-center justify-center p-lg">
      <Typography>Your option positions will appear here</Typography>
    </div>
  ) : (
    <Table
      //@ts-ignore
      ref={ref}
      containerClassName="min-w-full shadow mt-[1px] flex-grow max-h-full"
      className={cn('min-w-full bg-secondary')}>
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
        {isLoading && (
          <TableRow>
            <TableCell className="p-0" colSpan={6}>
              <MockProgressBar />
            </TableCell>
          </TableRow>
        )}
        {table.getRowModel().rows.map((row) => {
          return (
            <TableRow key={row.id} className={cn({ 'bg-selected': row.getIsSelected() })}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} style={{ width: `${cell.column.getSize()}px` }}>
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

export default BuyPositionsTable;
