import { ArrowBottomRightIcon, ArrowTopRightIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';
import { formatDistance } from 'date-fns';
import { formatUnits } from 'viem';

import { Checkbox } from '@/components/ui/checkbox';
import NumberDisplay from '@/components/ui/number-display';
import { Typography } from '@/components/ui/typography';
import ShareDialog from '../components/share-dialog';

import { BuyPositionType } from './hooks/useBuyPositionsData';

import LimitExercise from './limit-exercise';

export const columns: ColumnDef<BuyPositionType>[] = [
  {
    accessorKey: 'strike',
    header: ({ table }) => (
      <Typography className="uppercase" variant={'caption-bold'}>
        {table.options?.meta?.displayStrikesAsMarketCap ? 'Market Cap' : 'Strike'}
      </Typography>
    ),
    cell: ({ row, table }) => {
      const isPositivePnl = row.original.pnl.pnlUsdValue > 0;
      const marketCap = row.original.circulatingSupply * row.original.strikePriceUsd;

      return (
        <div className="justify-between flex items-center">
          <div className="flex items-center space-x-md">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => {
                isPositivePnl ? row.toggleSelected(!!value) : table.options?.meta?.showNonExercisablePositionToast?.();
              }}
              aria-label="Select row"
            />
            <Typography variant="small-medium">
              {table.options?.meta?.displayStrikesAsMarketCap ? (
                <NumberDisplay precision={4} value={marketCap} format="usd" />
              ) : (
                <NumberDisplay
                  showDecimalZerosSubscript
                  precision={6}
                  value={row.original.strikePriceUsd}
                  format="usd"
                />
              )}
            </Typography>
            {row.original.isMemePair && (
              <Typography className="text-muted-foreground" variant="small-medium">
                {'('}
                <NumberDisplay
                  showDecimalZerosSubscript
                  precision={8}
                  value={row.original.strike}
                  format="tokenAmount"
                />
                {` ${row.original.pnl.symbol}`}
                {')'}
              </Typography>
            )}
          </div>
          <div className="ml-md">
            {row.original.type === 'call' ? (
              <ArrowTopRightIcon className="mr-md h-4 w-4 text-success" />
            ) : (
              <ArrowBottomRightIcon className="mr-md h-4 w-4 text-destructive" />
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'size',
    header: () => (
      <Typography className="uppercase" variant={'caption-bold'}>
        Size
      </Typography>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col space-y-[1px]">
        <Typography variant="small-medium">
          <NumberDisplay
            value={Number(formatUnits(BigInt(row.original.size), row.original.token.decimals))}
            format="tokenAmount"
            precision={4}
          />
          {` ${row.original.token.symbol}`}
        </Typography>
      </div>
    ),
  },
  {
    accessorKey: 'expiry',
    header: () => (
      <Typography className="uppercase" variant={'caption-bold'}>
        Expiry
      </Typography>
    ),
    cell: ({ row }) => (
      <Typography variant="small-medium">
        {formatDistance(Number(row.original.meta.expiry) * 1000, new Date())}{' '}
        {Number(row.original.meta.expiry) * 1000 < new Date().getTime() && 'ago'}
      </Typography>
    ),
  },
  {
    accessorKey: 'breakeven',
    header: () => (
      <Typography className="uppercase" variant={'caption-bold'}>
        Breakeven
      </Typography>
    ),
    cell: ({ row, table }) => {
      const breakevenMarketCap = row.original.circulatingSupply * row.original.breakeven;
      return (
        <Typography variant="small-medium">
          {table.options?.meta?.displayStrikesAsMarketCap ? (
            <NumberDisplay precision={4} value={breakevenMarketCap} format="usd" />
          ) : (
            <NumberDisplay
              showDecimalZerosSubscript
              precision={row.original.isMemePair ? 7 : 4}
              value={row.original.breakeven}
              format="usd"
            />
          )}
        </Typography>
      );
    },
  },
  {
    accessorKey: 'premium',
    header: () => (
      <Typography className="uppercase" variant={'caption-bold'}>
        Premium
      </Typography>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col space-y-[1px]">
        <Typography variant="small-medium">
          <NumberDisplay
            value={Number(formatUnits(BigInt(row.original.premium), row.original.token.decimals))}
            format="tokenAmount"
            precision={4}
          />
          {` ${row.original.token.symbol}`}
        </Typography>
      </div>
    ),
  },
  {
    id: 'limitExercise',
    accessorKey: 'limitExercise',
    header: () => (
      <Typography className="uppercase" variant={'caption-bold'}>
        Limit Exercise
      </Typography>
    ),
    cell: ({ row, table }) => (
      <LimitExercise
        refetchBuyPositions={table.options?.meta?.refetchBuyPositions}
        displayStrikesAsMarketCap={table.options?.meta?.displayStrikesAsMarketCap}
        positionData={row.original}
      />
    ),
  },

  {
    accessorKey: 'pnl',
    header: () => (
      <Typography className="uppercase" variant={'caption-bold'}>
        Profit
      </Typography>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <Typography
            className={row.original.pnl.pnlReadable > 0 ? 'text-success' : 'text-destructive'}
            variant="small-medium">
            <NumberDisplay value={row.original.pnl.pnlReadable} format="tokenAmount" />
            {` ${row.original.pnl.symbol}`}
          </Typography>
          <Typography variant="small-medium">
            <NumberDisplay value={row.original.pnl.pnlUsdValue} format="usd" />
          </Typography>
        </div>
        <ShareDialog {...row.original} />
      </div>
    ),
  },
];
