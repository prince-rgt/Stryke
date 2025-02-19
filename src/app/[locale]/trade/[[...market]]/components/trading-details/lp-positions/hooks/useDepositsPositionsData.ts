import { TokenData } from '@/types';

import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { formatUnits, getAddress, zeroAddress } from 'viem';
import { base } from 'viem/chains';
import { useAccount } from 'wagmi';

import { getDeposits } from '@/utils/actions/varrock/positions';

import useStrikesStore from '../../../../hooks/store/useStrikesStore';
import useLocalStorage from '@/app/[locale]/hooks/useLocalStorage';

import { HOOKS_BY_CHAIN_ID, POOLS_BY_CHAIN_ID, SupportedTTLs } from '@/consts/clamm';

export interface FormattedPosition {
  isMemePair: boolean;
  utilization: number;
  handler: {
    name: string;
    deprecated: boolean;
  };
  supportedTTL: SupportedTTLs;
  earned: {
    amount0: string;
    amount1: string;
    amount0Symbol: string;
    amount1Symbol: string;
    amount0Decimals: number;
    amount1Decimals: number;
  };
  liquidity: {
    amount0: string;
    amount1: string;
    amount0Symbol: string;
    amount1Symbol: string;
    amount0Decimals: number;
    amount1Decimals: number;
  };
  newLiquidity: string;
  reserved: {
    lastReserve: number;
    amount0: string;
    amount1: string;
    amount0Symbol: string;
    amount1Symbol: string;
    amount0Decimals: number;
    amount1Decimals: number;
    withdrawable: {
      amount0: string;
      amount1: string;
      liquidity: string;
    };
  };
  withdrawable: {
    amount0: string;
    amount1: string;
    amount0Symbol: string;
    amount1Symbol: string;
    amount0Decimals: number;
    amount1Decimals: number;
  };
  withdraw: {
    initialLiquidity: string;
    shares: string;
    withdrawableLiquidity: string;
    hook: string;
    tokenId: string;
    amount0: string;
    amount1: string;
    amount0Symbol: string;
    amount1Symbol: string;
    amount0Decimals: number;
    amount1Decimals: number;
    handler: string;
    pool: string;
    tickLower: number;
    tickUpper: number;
  };
  range: {
    lower: number;
    lowerUsd: number;
    upper: number;
    upperUsd: number;
  };
  manage: DepositsPositionsData['manage'];
}

export interface DepositsPositionsData {
  isMemePair: boolean;
  tokens: {
    callToken: TokenData;
    putToken: TokenData;
  };
  utilization: number;
  manage: {
    refetch: () => void;
    positions: FormattedPosition[];
  };
  handler: {
    name: string;
    deprecated: boolean;
  };
  earned: {
    amount0: number;
    amount1: number;
    amount0Symbol: string;
    amount1Symbol: string;
  };
  withdrawable: {
    amount0: number;
    amount1: number;
    amount0Symbol: string;
    amount1Symbol: string;
  };
  reserved: {
    amount0Withdrawable: number;
    amount1Withdrawable: number;
    amount0Reserved: number;
    amount1Reserved: number;
    amount0Symbol: string;
    amount1Symbol: string;
  };

  range: {
    lower: number;
    lowerUsd: number;
    upper: number;
    upperUsd: number;
  };

  liquidity: {
    amount0: number;
    amount1: number;
    amount0Symbol: string;
    amount1Symbol: string;
  };
}

const useDepositsPositionsData = () => {
  const { selectedMarket, quoteAssetPriceUsd, markPriceUsd } = useStrikesStore();
  const { address: userAddress } = useAccount();
  const { address, chainId, isMemePair, pair } = selectedMarket;

  const [minLiquidityThresholdUSD, setMinLiquidityThresholdUSD] = useLocalStorage<number>(
    'syk-min-liquidity-threshold-usd',
    0.1,
  );

  const pools = useMemo(() => {
    if (!chainId || !selectedMarket || !address) return [];
    const _pools = (POOLS_BY_CHAIN_ID as { [key: number]: { [key: string]: string[] } })[chainId][
      address.toLowerCase()
    ];

    if (!_pools) return [];
    return _pools;
  }, [address, chainId, selectedMarket]);

  const data = useQueries({
    queries: pools.map((pool) => ({
      queryKey: ['deposits', userAddress, address, pool, chainId],
      queryFn: async () => {
        return await getDeposits(chainId, userAddress ?? zeroAddress, pool ?? zeroAddress, 1000, 0);
      },
      staleTime: 2000,
      refetchInterval: 2000,
    })),
  });

  // console.log('data', data);

  const depositsData = useMemo(() => {
    const depositsData = data.map(({ data }) => data ?? []).filter((data) => data.length > 0);
    const refetches = data.map(({ refetch }) => refetch);
    const handlerSortedPositions = [];

    const weeklyHookAddress =
      HOOKS_BY_CHAIN_ID[chainId as keyof typeof HOOKS_BY_CHAIN_ID][SupportedTTLs.WEEKLY][0]?.toLowerCase();

    let index = 0;
    if (depositsData.length > 0 && depositsData[0] && depositsData[0].length > 0) {
      for (const poolPositions of depositsData) {
        const refetch = refetches[index];
        index++;
        let totalEarned = {
          amount0: 0,
          amount1: 0,
          amount0Symbol: 'unknown',
          amount1Symbol: 'unknown',
        };

        let totalLiquidity = {
          amount0: 0,
          amount1: 0,
          amount0Symbol: 'unknown',
          amount1Symbol: 'unknown',
        };

        let totalWithdrawable = {
          amount0: 0,
          amount1: 0,
          amount0Symbol: 'unknown',
          amount1Symbol: 'unknown',
        };

        let totalReserve = {
          amount0Withdrawable: 0,
          amount1Withdrawable: 0,
          amount0Reserved: 0,
          amount1Reserved: 0,
          amount0Symbol: 'unknown',
          amount1Symbol: 'unknown',
        };

        let utilizationSum = 0;

        let range = {
          lower: 0,
          upper: 0,
          lowerUsd: 0,
          upperUsd: 0,
        };

        let deprecated = false;
        let handler = 'unknown';
        let _positions = [];

        if (poolPositions && poolPositions.length > 0) {
          for (const position of poolPositions) {
            const { earned, liquidity, meta, strikes, tokens, withdrawable, reserved } = position;
            const { token0, token1 } = tokens;
            const { tickLower, tickUpper, initialLiquidity, newLiquidity } = meta;
            deprecated = meta.handler.deprecated;

            const amount0Symbol = token0.symbol;
            const amount1Symbol = token1.symbol;

            handler = meta.handler.name;

            totalReserve = {
              amount0Withdrawable:
                totalReserve.amount0Withdrawable +
                Number(formatUnits(BigInt(reserved.withdrawable.token0), token0.decimals)),
              amount1Withdrawable:
                totalReserve.amount1Withdrawable +
                Number(formatUnits(BigInt(reserved.withdrawable.token1), token1.decimals)),
              amount0Reserved:
                totalReserve.amount0Reserved + Number(formatUnits(BigInt(reserved.token0), token0.decimals)),
              amount1Reserved:
                totalReserve.amount1Reserved + Number(formatUnits(BigInt(reserved.token1), token1.decimals)),
              amount0Symbol,
              amount1Symbol,
            };

            totalEarned = {
              amount0: Number(formatUnits(BigInt(earned.token0), token0.decimals)) + totalEarned.amount0,
              amount1: Number(formatUnits(BigInt(earned.token1), token1.decimals)) + totalEarned.amount1,
              amount0Symbol,
              amount1Symbol,
            };
            totalLiquidity = {
              amount0: Number(formatUnits(BigInt(liquidity.token0), token0.decimals)) + totalLiquidity.amount0,
              amount1: Number(formatUnits(BigInt(liquidity.token1), token1.decimals)) + totalLiquidity.amount1,
              amount0Symbol,
              amount1Symbol,
            };
            totalWithdrawable = {
              amount0: Number(formatUnits(BigInt(withdrawable.token0), token0.decimals)) + totalWithdrawable.amount0,
              amount1: Number(formatUnits(BigInt(withdrawable.token1), token1.decimals)) + totalWithdrawable.amount1,
              amount0Symbol,
              amount1Symbol,
            };

            const utilization =
              (1 -
                (Number(formatUnits(BigInt(withdrawable.token0), token0.decimals)) +
                  Number(formatUnits(BigInt(withdrawable.token1), token1.decimals))) /
                  (Number(formatUnits(BigInt(liquidity.token1), token1.decimals)) +
                    Number(formatUnits(BigInt(liquidity.token0), token0.decimals)))) *
              100;

            utilizationSum += utilization;

            const supportedTTL =
              meta.hook.toLowerCase() == weeklyHookAddress ? SupportedTTLs.WEEKLY : SupportedTTLs.INTRADAY;

            if (
              Number(formatUnits(BigInt(liquidity.token0), token0.decimals)) * markPriceUsd <
                minLiquidityThresholdUSD &&
              Number(formatUnits(BigInt(liquidity.token1), token1.decimals)) * quoteAssetPriceUsd <
                minLiquidityThresholdUSD &&
              Number(formatUnits(BigInt(reserved.token1), token1.decimals)) * quoteAssetPriceUsd <
                minLiquidityThresholdUSD &&
              Number(formatUnits(BigInt(reserved.token0), token0.decimals)) * markPriceUsd < minLiquidityThresholdUSD
            )
              continue;

            range = {
              lower: Math.min(range.lower === 0 ? strikes.put : range.lower, strikes.put),
              upper: Math.max(range.upper, strikes.call),
              lowerUsd: Math.min(range.lower === 0 ? strikes.put : range.lower, strikes.put) * quoteAssetPriceUsd,
              upperUsd: Math.max(range.upper, strikes.call) * quoteAssetPriceUsd,
            };

            _positions.push({
              isMemePair,
              utilization,
              handler: { name: meta.handler.name, deprecated: meta.handler.deprecated },
              supportedTTL,
              earned: {
                amount0: earned.token0,
                amount1: earned.token1,
                amount0Symbol,
                amount1Symbol,
                amount0Decimals: token0.decimals,
                amount1Decimals: token1.decimals,
              },
              liquidity: {
                amount0: liquidity.token0,
                amount1: liquidity.token1,
                amount0Symbol,
                amount1Symbol,
                amount0Decimals: token0.decimals,
                amount1Decimals: token1.decimals,
              },
              newLiquidity: newLiquidity,
              reserved: {
                lastReserve: reserved.lastReserve,
                amount0: reserved.token0,
                amount1: reserved.token1,
                amount0Symbol,
                amount1Symbol,
                amount0Decimals: token0.decimals,
                amount1Decimals: token1.decimals,
                withdrawable: {
                  amount0: reserved.withdrawable.token0,
                  amount1: reserved.withdrawable.token1,
                  liquidity: reserved.withdrawable.liquidity,
                },
              },

              withdrawable: {
                amount0: withdrawable.token0,
                amount1: withdrawable.token1,
                amount0Symbol,
                amount1Symbol,
                amount0Decimals: token0.decimals,
                amount1Decimals: token1.decimals,
              },
              withdraw: {
                initialLiquidity,
                shares: meta.shares,
                withdrawableLiquidity: meta.withdrawableLiquidity,
                hook: getAddress(meta.hook),
                tokenId: meta.tokenId,
                amount0: withdrawable.token0,
                amount1: withdrawable.token1,
                amount0Symbol,
                amount1Symbol,
                amount0Decimals: token0.decimals,
                amount1Decimals: token1.decimals,
                handler: getAddress(meta.handler.handler),
                pool: getAddress(meta.handler.pool),
                tickLower,
                tickUpper,
              },
              range: {
                lower: strikes.call,
                upper: strikes.put,
                lowerUsd: strikes.call * quoteAssetPriceUsd,
                upperUsd: strikes.put * quoteAssetPriceUsd,
              },
              manage: {
                refetch: () => null,
                positions: [],
              },
            });
          }
        }

        const utilizationTotal =
          (1 -
            (totalWithdrawable.amount0 + totalWithdrawable.amount1) /
              (totalLiquidity.amount0 + totalLiquidity.amount1)) *
          100;

        const positionsSorted = _positions.sort((a, b) => {
          return a.range.lower - b.range.lower;
        });

        if (positionsSorted.length) {
          handlerSortedPositions.push({
            isMemePair,
            tokens: {
              callToken: pair[0],
              putToken: pair[1],
            },
            handler: {
              name: handler,
              deprecated,
            },
            utilization: utilizationTotal,
            earned: totalEarned,
            liquidity: totalLiquidity,
            withdrawable: totalWithdrawable,
            reserved: totalReserve,
            range,
            manage: {
              positions: positionsSorted,
              refetch,
            },
          } as DepositsPositionsData);
        }
      }
    }

    return handlerSortedPositions;
  }, [chainId, data, isMemePair, markPriceUsd, minLiquidityThresholdUSD, pair, quoteAssetPriceUsd]);

  return { depositsData, setMinLiquidityThresholdUSD, minLiquidityThresholdUSD };
};

export default useDepositsPositionsData;
