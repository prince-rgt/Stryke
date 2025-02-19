import { ChevronDownIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import NumberDisplay from '@/components/ui/number-display';
import { Typography } from '@/components/ui/typography';
import UtilizationCell from '@/app/[locale]/components/markets-table/table-cells/utilization';

import { DepositsPositionsData } from './hooks/useDepositsPositionsData';

import ManageDialog from './manage-dialog';

export const columns: ColumnDef<DepositsPositionsData>[] = [
  // TODO: figure out a way for nesting to work
  // {
  //   // Expander column to show/hide position details
  //   id: 'expander',
  //   header: () => null,
  //   cell: ({ row }) => (
  //     <Button variant={"ghost"} onClick={() => row.toggleExpanded()}>
  //       {row.getIsExpanded() ? <ChevronDownIcon /> : <ChevronRightIcon />}
  //     </Button>
  //   ),
  // },

  {
    accessorKey: 'range',
    header: () => (
      <Typography className="uppercase" variant={'caption-bold'}>
        Range
      </Typography>
    ),
    cell: ({ row }) => {
      const isMemePair = row.original.isMemePair;
      return (
        <div className="flex w-full items-center space-x-md">
          {/* <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        /> */}
          <div className="flex w-full flex-col">
            <div className="flex w-full items-center justify-between">
              <Typography variant="small-medium">
                <NumberDisplay
                  showDecimalZerosSubscript
                  precision={isMemePair ? 6 : 4}
                  value={row.original.range.lowerUsd}
                  format="usd"
                />{' '}
              </Typography>
              {isMemePair && (
                <Typography className="ml-0.5 text-right text-muted-foreground" variant="small-medium">
                  {`(`}
                  <NumberDisplay
                    showDecimalZerosSubscript
                    precision={10}
                    value={row.original.range.lower}
                    format="tokenAmount"
                  />
                  {` `}
                  {row.original.tokens.putToken.symbol}
                  {`)`}
                </Typography>
              )}
            </div>
            <div className="flex w-full items-center justify-between">
              <Typography variant="small-medium">
                <NumberDisplay
                  showDecimalZerosSubscript
                  precision={4}
                  value={row.original.range.upperUsd}
                  format="usd"
                />{' '}
              </Typography>
              {isMemePair && (
                <Typography className="ml-0.5 text-right text-muted-foreground" variant="small-medium">
                  {`(`}
                  <NumberDisplay
                    showDecimalZerosSubscript
                    precision={10}
                    value={row.original.range.upper}
                    format="tokenAmount"
                  />
                  {` `}
                  {row.original.tokens.putToken.symbol}
                  {`)`}
                </Typography>
              )}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'handler',
    header: () => (
      <Typography className="uppercase" variant={'caption-bold'}>
        AMM
      </Typography>
    ),
    cell: ({ row }) => (
      <Typography className="uppercase" variant="small-medium">
        {row.original.handler.name}
      </Typography>
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
          <NumberDisplay value={row.original.liquidity.amount0} format="tokenAmount" precision={5} />
          {` ${row.original.liquidity.amount0Symbol}`}
        </Typography>
        <Typography variant="small-medium">
          <NumberDisplay value={row.original.liquidity.amount1} format="tokenAmount" precision={5} />
          {` ${row.original.liquidity.amount1Symbol}`}
        </Typography>
      </div>
    ),
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
          <NumberDisplay value={row.original.earned.amount0} format="tokenAmount" precision={5} />
          {` ${row.original.earned.amount0Symbol}`}
        </Typography>
        <Typography variant="small-medium">
          <NumberDisplay value={row.original.earned.amount1} format="tokenAmount" precision={5} />
          {` ${row.original.earned.amount1Symbol}`}
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
    accessorKey: 'withdrawable',
    header: () => (
      <Typography className="uppercase" variant={'caption-bold'}>
        Withdrawable
      </Typography>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <Typography variant="small-medium">
          <NumberDisplay value={row.original.withdrawable.amount0} format="tokenAmount" precision={5} />
          {` ${row.original.withdrawable.amount0Symbol}`}
        </Typography>
        <Typography variant="small-medium">
          <NumberDisplay value={row.original.withdrawable.amount1} format="tokenAmount" precision={5} />
          {` ${row.original.withdrawable.amount1Symbol}`}
        </Typography>
      </div>
    ),
  },
  {
    accessorKey: 'reserved',
    header: () => (
      <Typography className="uppercase" variant={'caption-bold'}>
        Reserved
      </Typography>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <Typography variant="small-medium">
          <NumberDisplay value={row.original.reserved.amount0Reserved} format="tokenAmount" precision={5} />
          {` ${row.original.reserved.amount0Symbol}`}
        </Typography>
        <Typography variant="small-medium">
          <NumberDisplay value={row.original.reserved.amount1Reserved} format="tokenAmount" precision={5} />
          {` ${row.original.reserved.amount1Symbol}`}
        </Typography>
      </div>
    ),
  },

  {
    accessorKey: 'manage',
    header: () => (
      <Typography className="uppercase" variant={'caption-bold'}>
        Manage
      </Typography>
    ),
    cell: ({ row }) => <ManageDialog manageData={row.original.manage} />,
  },
];
