import { getCoreRowModel, getSortedRowModel, Row, useReactTable } from '@tanstack/react-table';
import React, { useCallback } from 'react';

import { cn } from '@/utils/styles';

import { RadioGroup } from '@/components/ui/radio'; // Import RadioGroup
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import useGaugeControllerStore from '../../../../hooks/useGaugeController';
import useGaugeController from '../../../../hooks/useGaugeController';

import { RowData } from '../../../../types';
import { Columns } from '../columns';

const GaugesTable: React.FC = () => {
  const { selectedRow, updateSelectedRow } = useGaugeControllerStore();
  const { isLoading, processedGaugesArray: gaugesArray } = useGaugeController();

  const onRowSelectionChange = useCallback(
    (updater: ((old: Record<string, boolean>) => Record<string, boolean>) | Record<string, boolean>) => {
      if (!gaugesArray) return;
      updateSelectedRow((oldSelectedRow) => {
        const newSelection = typeof updater === 'function' ? updater({}) : updater;
        const selectedRows = Object.keys(newSelection);
        const selectedRowData =
          selectedRows.length > 0 ? gaugesArray.find((row) => row.name === selectedRows[0]) : null;
        return selectedRowData || null;
      });
    },
    [gaugesArray, updateSelectedRow],
  );

  const table = useReactTable({
    data: gaugesArray ?? [],
    columns: Columns(true),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.name,
    enableRowSelection: true,
    onRowSelectionChange,
    state: {
      rowSelection: selectedRow ? { [selectedRow.name]: true } : {},
    },
  });

  const handleRowClick = useCallback(
    (row: Row<RowData>) => {
      table.setRowSelection({ [row.id]: true });
    },
    [table],
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-md">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full rounded-none" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <RadioGroup
        value={selectedRow ? selectedRow.name : undefined}
        onValueChange={(value) => {
          const selectedRowData = gaugesArray?.find((row) => row.name === value) || null;
          updateSelectedRow(selectedRowData);
        }}>
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
              <TableRow
                key={row.id}
                className={cn('cursor-pointer border-0', { 'bg-selected': row.getIsSelected() })}
                onClick={() => handleRowClick(row)}>
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
      </RadioGroup>
    </div>
  );
};

export default GaugesTable;
