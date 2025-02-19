'use client';

import {
  ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  GroupingState,
  useReactTable,
} from '@tanstack/react-table';
import React from 'react';
import { useMeasure, useWindowSize } from 'react-use';

import { cn } from '@/utils/styles';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Typography } from '@/components/ui/typography';

import useStrikesStore from '../../../hooks/store/useStrikesStore';
import { DepositsPositionsData } from './hooks/useDepositsPositionsData';

import { columns } from './columns';

const LpPositionsTable = ({ depositsData }: { depositsData: DepositsPositionsData[] }) => {
  const { isChartCollapsed, selectedMarket } = useStrikesStore();
  const { isMemePair } = selectedMarket;

  const { height: windowHeight } = useWindowSize();
  const [ref, { width: tableWidth }] = useMeasure();
  // const [expanded, setExpanded] = React.useState<ExpandedState>({});

  // todo: way too hacky, but couldn't find a better cuz table is messing things up
  // find a better way to do this
  const height = windowHeight - 36.5 - 1 - 40 - 1 - (isChartCollapsed ? 1 : 300) - 1 - 32 - 1 - 48.5 - 48.5 - 2;

  const table = useReactTable({
    data: depositsData,
    columns: columns.map((column, i) => {
      if (isMemePair) {
        if (i === 0) {
          return { size: 200, ...column };
        }
        return { size: (tableWidth - 200) / (columns.length - 1), ...column };
      }
      return { size: tableWidth / columns.length, ...column };
    }),
    getCoreRowModel: getCoreRowModel(),
    // onRowSelectionChange,
    // state: {
    //   rowSelection: selectedPositions,
    // },
    getRowId: (row) => String(row.range.lower),
    // state: {
    //   expanded,
    // },
    // onExpandedChange: setExpanded,
    // getExpandedRowModel: getExpandedRowModel(),
    // getSubRows: (row) => row.manage.positions,
  });

  return depositsData.length === 0 ? (
    <div className="flex w-full items-center justify-center p-lg">
      <Typography>Your deposit positions will appear here</Typography>
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
        {table.getRowModel().rows.map((row) => {
          return (
            <React.Fragment key={row.id}>
              <TableRow key={row.id} className={cn({ 'bg-selected': row.getIsSelected() })}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} style={{ width: `${cell.column.getSize()}px` }}>
                    {typeof cell.column.columnDef.cell === 'function'
                      ? cell.column.columnDef.cell(cell.getContext())
                      : cell.getValue()}
                  </TableCell>
                ))}
              </TableRow>
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default React.memo(LpPositionsTable);
