import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { cn } from '@/utils/styles';

import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Typography } from '@/components/ui/typography';

import useGaugeController from '../../../../hooks/useGaugeController';

import { Columns } from '../columns';

const VotesTable: React.FC = () => {
  const { isLoading, processedGaugesArray } = useGaugeController();

  const data = useMemo(() => {
    return processedGaugesArray ? processedGaugesArray.filter((gauge) => gauge.userWeight !== BigInt(0)) : [];
  }, [processedGaugesArray]);

  const table = useReactTable({
    data,
    columns: Columns(false),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.name,
    enableRowSelection: true,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-md">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full rounded-none" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex w-full items-center justify-center p-lg">
        <Typography className="m-2">No active votes to Display.</Typography>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <Table className="w-full border-collapse bg-secondary">
        <TableHeader>
          <TableRow className="border-none">
            {table.getFlatHeaders().map((header) => (
              <TableHead key={header.id} className="h-6 px-4">
                {header.isPlaceholder
                  ? null
                  : typeof header.column.columnDef.header === 'function'
                    ? header.column.columnDef.header(header.getContext())
                    : header.column.columnDef.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className={cn('border-0', { 'bg-selected': row.getIsSelected() })}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="border-0 px-4 py-2">
                  {typeof cell.column.columnDef.cell === 'function'
                    ? cell.column.columnDef.cell(cell.getContext())
                    : cell.getValue()}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default React.memo(VotesTable);
