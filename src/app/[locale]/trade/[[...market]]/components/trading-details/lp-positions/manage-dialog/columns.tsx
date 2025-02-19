import { ColumnDef } from '@tanstack/react-table';
import { formatUnits } from 'viem';

import { Checkbox } from '@/components/ui/checkbox';
import NumberDisplay from '@/components/ui/number-display';
import { Typography } from '@/components/ui/typography';
import UtilizationCell from '@/app/[locale]/components/markets-table/table-cells/utilization';

import { FormattedPosition } from '../hooks/useDepositsPositionsData';

import Reserve from './Reserve';

export const columns: ColumnDef<FormattedPosition>[] = [
  {
    accessorKey: 'range',
    header: ({ table }) => (
      <div className="flex items-center space-x-md">
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
          aria-label="Select row"
        />
        <Typography className="uppercase" variant={'caption-bold'}>
          Range
        </Typography>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center space-x-md">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
        <div className="flex flex-col">
          <div className="flex">
            <Typography variant="small-medium">
              <NumberDisplay
                showDecimalZerosSubscript={row.original.isMemePair}
                precision={row.original.isMemePair ? 7 : 4}
                value={row.original.range.upperUsd}
                format="usd"
              />
            </Typography>
            {row.original.isMemePair && (
              <Typography className="ml-1 text-muted-foreground" variant="small-medium">
                {`(`}
                <NumberDisplay
                  showDecimalZerosSubscript
                  precision={10}
                  value={row.original.range.upper}
                  format="tokenAmount"
                />
                {` `}
                {row.original.liquidity.amount1Symbol}
                {`)`}
              </Typography>
            )}
          </div>
          <div className="flex">
            <Typography variant="small-medium">
              <NumberDisplay
                showDecimalZerosSubscript={row.original.isMemePair}
                precision={row.original.isMemePair ? 7 : 4}
                value={row.original.range.lowerUsd}
                format="usd"
              />{' '}
            </Typography>
            {row.original.isMemePair && (
              <Typography className="ml-1 text-muted-foreground" variant="small-medium">
                {`(`}
                <NumberDisplay
                  showDecimalZerosSubscript
                  precision={10}
                  value={row.original.range.lower}
                  format="tokenAmount"
                />
                {` `}
                {row.original.liquidity.amount1Symbol}
                {`)`}
              </Typography>
            )}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'liquidity',
    header: () => (
      <Typography className="uppercase" variant={'caption-bold'}>
        Liquidity
      </Typography>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <Typography variant="small-medium">
          <NumberDisplay
            value={Number(formatUnits(BigInt(row.original.liquidity.amount0), row.original.liquidity.amount0Decimals))}
            format="tokenAmount"
            precision={5}
          />
          {` ${row.original.liquidity.amount0Symbol}`}
        </Typography>
        <Typography variant="small-medium">
          <NumberDisplay
            value={Number(formatUnits(BigInt(row.original.liquidity.amount1), row.original.liquidity.amount1Decimals))}
            format="tokenAmount"
            precision={5}
          />
          {` ${row.original.liquidity.amount1Symbol}`}
        </Typography>
      </div>
    ),
  },
  {
    accessorKey: 'utilization',
    header: () => (
      <Typography className="uppercase" variant={'caption-bold'}>
        utilization
      </Typography>
    ),
    cell: ({ row }) => <UtilizationCell value={row.original.utilization} />,
  },
  {
    accessorKey: 'supportedTTL',
    header: () => (
      <Typography className="uppercase" variant={'caption-bold'}>
        Expiry
      </Typography>
    ),
    cell: ({ row }) => <Typography variant="small-medium">{row.original.supportedTTL}</Typography>,
  },

  {
    accessorKey: 'earned',
    header: () => (
      <Typography className="uppercase" variant={'caption-bold'}>
        Earnings
      </Typography>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <Typography variant="small-medium">
          <NumberDisplay
            value={Number(formatUnits(BigInt(row.original.earned.amount0), row.original.earned.amount0Decimals))}
            format="tokenAmount"
            precision={5}
          />
          {` ${row.original.earned.amount0Symbol}`}
        </Typography>
        <Typography variant="small-medium">
          <NumberDisplay
            value={Number(formatUnits(BigInt(row.original.earned.amount1), row.original.earned.amount1Decimals))}
            format="tokenAmount"
            precision={5}
          />
          {` ${row.original.earned.amount1Symbol}`}
        </Typography>
      </div>
    ),
  },

  {
    accessorKey: 'withdrawable',
    header: () => (
      <Typography className="uppercase" variant={'caption-bold'}>
        Withdrawable
      </Typography>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <Typography variant="small-medium">
          <NumberDisplay
            value={Number(
              formatUnits(BigInt(row.original.withdrawable.amount0), row.original.withdrawable.amount0Decimals),
            )}
            format="tokenAmount"
            precision={5}
          />
          {` ${row.original.withdrawable.amount0Symbol}`}
        </Typography>
        <Typography variant="small-medium">
          <NumberDisplay
            value={Number(
              formatUnits(BigInt(row.original.withdrawable.amount1), row.original.withdrawable.amount1Decimals),
            )}
            format="tokenAmount"
            precision={5}
          />
          {` ${row.original.withdrawable.amount1Symbol}`}
        </Typography>
      </div>
    ),
  },
  {
    accessorKey: 'reserved',
    header: () => (
      <Typography className="ml-12 uppercase" variant={'caption-bold'}>
        Reserved
      </Typography>
    ),
    cell: ({ row }) => <Reserve positionData={row.original} />,
  },
];
