import type { MarketData } from '@/types';

import { ColumnDef } from '@tanstack/react-table';
import { sonic } from 'viem/chains';

import NumberDisplay from '@/components/ui/number-display';
import { Typography } from '@/components/ui/typography';

import APRCell from './table-cells/apr';
import LiquidityCell from './table-cells/liquidity';
import PairCell from './table-cells/pair';
import UtilizationCell from './table-cells/utilization';
import TableHeader from './table-header';

// 32.5% goes to gems
// 30 protocols getting gems
// 10 for each gem tier
// 3x, 2x, 1x multiplier for each gem
// Multiply 4b * 0.32 * (1/60)
const STRYKE_GEMS_POINTS_PER_DAY = 21333333.33333333;

const SONIC_POINTS_TO_USD = 0.0001125;
const SONIC_POINTS_PER_DAY_PER_DOLLAR = 3;

function calculateSonicPointsApr(): number {
  const dollarValuePerDay = SONIC_POINTS_PER_DAY_PER_DOLLAR * SONIC_POINTS_TO_USD;
  const annualizedReturn = dollarValuePerDay * 365;
  return annualizedReturn * 100; // Convert to percentage
}
function getTotalSonicTVL(allMarkets: MarketData[]): number {
  return allMarkets
    .filter((market) => market.chainId === sonic.id)
    .reduce((total, market) => total + market.liquidity.totalLiquidity, 0);
}

function calculateSonicGemsApr(market: MarketData, allMarkets: MarketData[]): number {
  const totalSonicTVL = getTotalSonicTVL(allMarkets);

  // If there's no TVL on Sonic, return 0 to avoid division by zero
  if (totalSonicTVL === 0) return 0;

  // Calculate market's share of the daily points based on its TVL proportion
  const marketTVL = market.liquidity.totalLiquidity;
  const marketShareOfPoints = STRYKE_GEMS_POINTS_PER_DAY * (marketTVL / totalSonicTVL);

  // Convert points to USD value
  const dailyUsdValue = marketShareOfPoints * SONIC_POINTS_TO_USD;

  // Calculate annualized return as a percentage
  const annualizedReturn = dailyUsdValue * 365;
  return (annualizedReturn / marketTVL) * 100;
}

export const marketColumns: ColumnDef<MarketData>[] = [
  {
    accessorKey: 'pair',
    header: ({ column }) => <TableHeader column={column} label="Pair" />,
    cell: (info) => <PairCell pair={info.getValue() as MarketData['pair']} />,
    sortingFn: (rowA, rowB) => {
      const symbolA = rowA.original.pair[0].symbol;
      const symbolB = rowB.original.pair[0].symbol;
      return symbolB > symbolA ? -1 : symbolA > symbolB ? 1 : 0;
    },
  },
  {
    accessorKey: 'chainName',
    header: ({ column }) => <TableHeader column={column} label="Network" />,
    cell: ({ row }) => <div className="capitalize px-md">{row.original.chainName}</div>,
  },
  {
    accessorKey: 'liquidity',
    sortingFn: (rowA, rowB) => {
      const liquidityA = rowA.original.liquidity.totalLiquidity;
      const liquidityB = rowB.original.liquidity.totalLiquidity;
      return liquidityB > liquidityA ? -1 : liquidityA > liquidityB ? 1 : 0;
    },
    header: ({ column }) => <TableHeader column={column} label="AvailableLiquidity" labelSecondary="TotalLiquidity" />,
    cell: (info): React.ReactNode => <LiquidityCell liquidity={info.getValue() as MarketData['liquidity']} />,
  },

  {
    accessorKey: 'openInterest',
    header: ({ column }) => <TableHeader column={column} label="OpenInterest" />,
    cell: (info): React.ReactNode => (
      <Typography className="px-md" variant="small-medium">
        <NumberDisplay value={info.getValue() as MarketData['openInterest']} format="usd" />
      </Typography>
    ),
  },

  {
    accessorKey: 'utilization',
    header: ({ column }) => <TableHeader column={column} label="Utilization" />,
    cell: (info): React.ReactNode => <UtilizationCell value={info.getValue() as MarketData['utilization']} />,
  },

  {
    accessorKey: 'volume24h',
    header: ({ column }) => <TableHeader column={column} label="24hVolume" />,
    cell: (info): React.ReactNode => (
      <Typography className="px-md" variant="small-medium">
        {' '}
        <NumberDisplay value={info.getValue() as MarketData['volume24h']} format="usd" />{' '}
      </Typography>
    ),
  },
  {
    accessorKey: 'earningsApr',
    header: ({ column }) => <TableHeader column={column} label="EarningsApr" />,
    sortingFn: (rowA, rowB) => {
      // Since we can't access all markets here, we'll sort by base APR
      // plus points for Sonic chain (gems APR would need total TVL data)
      const getComparableApr = (row: { original: MarketData }) => {
        const baseApr = row.original.earningsApr.low || 0;

        if (row.original.chainId !== sonic.id) {
          return baseApr;
        }

        // Add points APR for Sonic chain
        return baseApr + calculateSonicPointsApr() + 100;
      };

      const aprA = getComparableApr(rowA);
      const aprB = getComparableApr(rowB);

      return aprB - aprA; // Sort in descending order
    },
    cell: (info): React.ReactNode => {
      const earningsApr = info.getValue() as MarketData['earningsApr'];
      const row = info.row.original;
      // Get access to all market data through table instance
      const allMarkets = info.table.options.data as MarketData[];

      const breakdown = {
        earnings: {
          low: earningsApr.low,
          high: earningsApr.high,
        },
        rewards: {
          gems: row.chainId === sonic.id ? calculateSonicGemsApr(row, allMarkets) : undefined,
          points: row.chainId === sonic.id ? calculateSonicPointsApr() : undefined,
        },
      };

      return <APRCell breakdown={breakdown} />;
    },
  },
];
