import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useMeasure } from 'react-use';

import { cn } from '@/utils/styles';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Typography } from '@/components/ui/typography';

import useXSykData from '@/app/[locale]/xsyk/hooks/useXSykData';

import { columns } from './columns/vesting';

const VestingPositions = () => {
  const t = useTranslations('xSYK');

  const [ref, { width: tableWidth }] = useMeasure();
  const { activePositions: data, isLoading } = useXSykData();

  const table = useReactTable({
    data,
    columns: columns.map((column) => ({ ...column, size: tableWidth / 4 })),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center bg-secondary border-b border-background h-[243px]">
        <Typography variant="p-medium" className="p-md">
          Loading...
        </Typography>
      </div>
    );

  return (
    <div
      className={`flex flex-col items-center justify-center bg-secondary border-b border-background max-h-[350px] overflow-y-auto`}>
      {data.length === 0 ? (
        <Typography variant="p-medium" className="p-md my-12">
          {t('EmptyTables.Vests')}
        </Typography>
      ) : (
        <Table
          //@ts-ignore
          ref={ref}>
          <TableHeader style={{ height: 24 }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} style={{ border: 0 }} className="bg-secondary">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: `${header.getSize()}px`, paddingLeft: 6, paddingRight: 6, height: 24 }}>
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
          <TableBody ref={null}>
            {table.getRowModel().rows.map((row) => {
              return (
                <TableRow
                  className={cn({ 'bg-selected': row.getIsSelected() })}
                  style={{ height: 40, border: 0 }}
                  key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      style={{ width: `${cell.column.getSize()}px`, paddingTop: 0, paddingBottom: 0 }}
                      key={cell.id}>
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

export default VestingPositions;
