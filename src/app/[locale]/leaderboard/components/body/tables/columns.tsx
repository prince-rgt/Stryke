import { UserPnlResponseDto } from '@/app/[locale]/leaderboard/types';
import { ColumnDef } from '@tanstack/react-table';
import { LucideTrophy } from 'lucide-react';
import { getAddress, zeroAddress } from 'viem';

import { cn } from '@/utils/styles';
import { smartTrim } from '@/app/[locale]/leaderboard/utils';

import { Badge } from '@/components/ui/badge';
import NumberDisplay from '@/components/ui/number-display';
import { Typography } from '@/components/ui/typography';
import TableHeader from '@/app/[locale]/leaderboard/components/body/tables/table-header';

/**
 * rank
 * trader
 * pnl
 * premiumPaid
 * volume (notional)
 **/

export const columns: ColumnDef<UserPnlResponseDto & { rank: number }>[] = [
  {
    accessorKey: 'rank',
    header: ({ column }) => <TableHeader column={column} label="Rank" />,
    cell: (info) => (
      <div className="flex items-center space-x-2">
        <Typography className="px-md min-w-[32px]" variant="small-medium">
          {info.row.original.rank}
        </Typography>
        {info.row.original.rank < 4 ? (
          <LucideTrophy
            width={16}
            height={16}
            className={cn({
              'text-accent': info.row.original.rank === 1,
              'text-[#C0C0C0]': info.row.original.rank === 2,
              'text-[#CD7F32]': info.row.original.rank === 3,
            })}
          />
        ) : null}
      </div>
    ),
  },
  {
    accessorKey: 'user',
    header: ({ column }) => <TableHeader column={column} label="Account" />,
    cell: ({ row, table }) => {
      return (
        <div className="flex space-x-2 items-center">
          <Typography variant="p-medium" className="capitalize px-md">
            {smartTrim(getAddress(row.original.user ?? zeroAddress))}
          </Typography>
          {table.options?.meta?.yourAddress && table.options?.meta?.yourAddress === row.original.user ? (
            <Badge bgColor="grey">You</Badge>
          ) : null}
        </div>
      );
    },
  },
  {
    accessorKey: 'pnl',
    header: ({ column }) => <TableHeader column={column} label="P&L" />,
    cell: (info): React.ReactNode => (
      <Typography
        className={cn(`px-md`, {
          'text-destructive': (info.getValue() as UserPnlResponseDto['pnl']) < 0,
          'text-success': (info.getValue() as UserPnlResponseDto['pnl']) > 0,
        })}
        variant="small-medium">
        <NumberDisplay value={info.getValue() as UserPnlResponseDto['pnl']} format="usd" precision={3} />
      </Typography>
    ),
  },
  {
    accessorKey: 'premiumPaid',
    header: ({ column }) => <TableHeader column={column} label="Premium Paid" />,
    cell: (info): React.ReactNode => (
      <Typography className="px-md" variant="small-medium">
        <NumberDisplay value={info.getValue() as UserPnlResponseDto['premiumPaid']} format="usd" precision={2} />
      </Typography>
    ),
  },
  {
    accessorKey: 'volume',
    header: ({ column }) => <TableHeader column={column} label="Trading Volume" />,
    cell: (info): React.ReactNode => (
      <Typography className="px-md" variant="small-medium">
        {' '}
        <NumberDisplay value={Number(info.getValue() as UserPnlResponseDto['volume'])} format="usd" />
      </Typography>
    ),
  },
];
