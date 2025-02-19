import { Earnings } from '@/app/[locale]/xsyk/types';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { formatUnits } from 'viem';

import { formatForDisplay } from '@/components/ui/number-display';
import { Typography } from '@/components/ui/typography';

export const columns: ColumnDef<Earnings, any>[] = [
  {
    accessorKey: 'token',
    header: () => (
      <Typography className="uppercase text-muted-foreground" variant="small-medium">
        Token
      </Typography>
    ),
    sortingFn: (rowA, rowB) => {
      const xSykAmountA = Number(rowA.original.symbol);
      const xSykAmountB = Number(rowB.original.symbol);
      return xSykAmountB > xSykAmountA ? -1 : xSykAmountA > xSykAmountB ? 1 : 0;
    },
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 text-end items-center">
          <Image
            src={`/images/tokens/${row.original.symbol.toLowerCase()}.svg`}
            alt={row.original.symbol}
            width={24}
            height={24}
          />
          <Typography variant="small-medium" className="text-muted-foreground">
            {row.original.symbol}
          </Typography>
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: () => (
      <Typography className="uppercase text-muted-foreground text-right" variant="small-medium">
        Earned
      </Typography>
    ),
    sortingFn: (rowA, rowB) => {
      const toAmountA = Number(rowA.original.amount);
      const toAmountB = Number(rowB.original.amount);
      return toAmountB > toAmountA ? -1 : toAmountA > toAmountB ? 1 : 0;
    },
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 justify-end">
          <Typography variant="small-medium">
            {formatForDisplay({
              value: Number(formatUnits(BigInt(row.original.amount), row.original.decimals)),
              format: 'tokenAmount',
            })}
          </Typography>
          <Typography variant="small-medium" className="text-muted-foreground">
            {row.original.symbol}
          </Typography>
        </div>
      );
    },
  },
];
