import { SupportedChainIdType } from '@/types';

import { ColumnDef } from '@tanstack/react-table';
import { map } from 'lodash';
import { SparklesIcon } from 'lucide-react';
import { checksumAddress } from 'viem';

import { Checkbox } from '@/components/ui/checkbox';
import NumberDisplay from '@/components/ui/number-display';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Typography } from '@/components/ui/typography';

import { StrikeDisplay } from '../../../../hooks/store/useStrikesStore';

import { INCENTIVIZED_POOLS, OVERRIDDEN_MARKET_DECIMALS } from '@/consts/clamm';

export const columns: ColumnDef<StrikeDisplay>[] = [
  {
    accessorKey: 'strikePrice',
    header: ({ table }) => (
      <Typography className="uppercase" variant={'caption-bold'}>
        {
          //@ts-ignore
          table.options?.meta?.displayStrikesAsMarketCap ? 'Market Cap' : 'Strike'
        }
      </Typography>
    ),
    cell: ({ row, table }) => {
      const marketCap = row.original.circulatingSupply * row.original.strikePriceUsd;
      const decimals = OVERRIDDEN_MARKET_DECIMALS[checksumAddress(row.original.primePool)] ?? 4;
      return (
        <div className="flex items-center justify-start space-x-md">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
          <Typography variant="small-medium">
            {
              //@ts-ignore
              table.options?.meta?.displayStrikesAsMarketCap ? (
                <NumberDisplay precision={4} value={marketCap} format="usd" />
              ) : (
                <NumberDisplay
                  showDecimalZerosSubscript
                  precision={row.original.isMemePair ? 7 : decimals}
                  value={row.original.strikePriceUsd}
                  format="usd"
                />
              )
            }
          </Typography>
          {row.original.isMemePair && (
            <Typography className="text-muted-foreground" variant="small-medium">
              {'('}
              <NumberDisplay
                showDecimalZerosSubscript
                precision={8}
                value={row.original.strikePrice}
                format="tokenAmount"
              />
              {` ${row.original.putToken.symbol}`}
              {')'}
            </Typography>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'availableLiquidity',
    header: () => (
      <Typography className="uppercase" variant={'caption-bold'}>
        Avail. Liquidity (Intraday)
      </Typography>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col space-y-[1px]">
        <Typography variant="small-medium">
          <NumberDisplay format="tokenAmount" value={row.original.availableLiquidity.amountToken} />
          {` ${row.original.token.symbol}`}
        </Typography>
        <Typography variant="small-medium">
          <NumberDisplay value={row.original.availableLiquidity.amountUSD} format="usd" />
        </Typography>
      </div>
    ),
  },
  {
    accessorKey: 'availableLiquidityWeekly',
    header: () => (
      <Typography className="uppercase" variant={'caption-bold'}>
        Avail. Liquidity (Weekly)
      </Typography>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col space-y-[1px]">
        <Typography variant="small-medium">
          <NumberDisplay format="tokenAmount" value={row.original.availableLiquidityWeekly.amountToken} />
          {` ${row.original.token.symbol}`}
        </Typography>
        <Typography variant="small-medium">
          <NumberDisplay value={row.original.availableLiquidityWeekly.amountUSD} format="usd" />
        </Typography>
      </div>
    ),
  },
  {
    accessorKey: 'totalLiquidity',
    header: () => (
      <Typography className="uppercase" variant={'caption-bold'}>
        Total Liquidity
      </Typography>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col space-y-[1px]">
        <Typography variant="small-medium">
          <NumberDisplay format="tokenAmount" value={row.original.totalLiquidity.amountToken} />
          {` ${row.original.callToken.symbol}`}
        </Typography>
        <Typography variant="small-medium">
          <NumberDisplay value={row.original.totalLiquidity.amountUSD} format="usd" />
        </Typography>
      </div>
    ),
  },
  {
    accessorKey: 'utilization',
    header: () => (
      <Typography className="uppercase" variant={'caption-bold'}>
        Utilization
      </Typography>
    ),

    cell: ({ row }) => (
      <div className="flex w-full items-center justify-between">
        <Typography variant="small-medium">
          <NumberDisplay value={row.original.utilization} format="percent" />{' '}
        </Typography>
        <div className="w-[40%]">
          <Progress value={row.original.utilization} />
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'earnings',
    header: () => (
      <Typography className="text-right uppercase" variant={'caption-bold'}>
        Earnings
      </Typography>
    ),
    cell: ({ row }) => (
      <div className="grid w-full grid-flow-col place-content-end items-center space-x-2">
        <Typography variant="small-medium">
          <NumberDisplay value={row.original.feeApr} format="percent" />
        </Typography>
        {row.original.incentivized ? (
          <Tooltip>
            <TooltipTrigger className="flex space-x-2 hover:cursor-default">
              <SparklesIcon width={12} height={12} className="fill-current text-highlight" />
            </TooltipTrigger>
            <TooltipContent>
              Plus rewards in{' '}
              {INCENTIVIZED_POOLS[row.original.chainId as SupportedChainIdType]?.[
                checksumAddress(row.original.primePool)
              ]?.tokens?.reduce((prev, curr) => (prev ? prev + ', ' : prev) + curr.symbol, '')}
            </TooltipContent>
          </Tooltip>
        ) : null}
      </div>
    ),
  },
];

export const columnIds = map(columns, 'accessorKey') as string[];
