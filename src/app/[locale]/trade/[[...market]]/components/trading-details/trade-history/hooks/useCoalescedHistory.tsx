import { SupportedChainIdType } from '@/types';
import { HistoricDeposit, HistoricWithdraw } from '@/types/varrock';

import { useQuery } from '@tanstack/react-query';
import { Dictionary, groupBy } from 'lodash';
import { useMemo } from 'react';
import { Address, formatUnits, zeroAddress } from 'viem';

import {
  getHistoricDeposits,
  getHistoricExercises,
  getHistoricPurchases,
  getHistoricSettlements,
  getHistoricWithdrawals,
} from '@/utils/actions/varrock/history';

import NumberDisplay, { formatForDisplay } from '@/components/ui/number-display';
import { Typography } from '@/components/ui/typography';
import { HistoryEntry } from '@/app/[locale]/trade/[[...market]]/components/trading-details/trade-history/columns';
import useFilterStore from '@/app/[locale]/trade/[[...market]]/components/trading-details/trade-history/store';

import useStrikesStore from '../../../../hooks/store/useStrikesStore';

import { POOLS_BY_CHAIN_ID } from '@/consts/clamm';

const EXPIRY_MAPPING: { [key: string]: string } = {
  '3600': '1H',
  '7200': '2H',
  '21600': '6H',
  '43200': '12H',
  '86400': '24H',
  '604800': '1W',
};

type Props = {
  chainId: number;
  user: Address;
};

function _prettifyData(
  data: Dictionary<((HistoricDeposit | HistoricWithdraw) & { chainId: SupportedChainIdType })[]>,
  label: string,
) {
  return Object.values(data).map((d) => {
    const chainId = d[0].chainId;
    const strikes = [d[0].strikes.put, d[d.length - 1].strikes.call].sort((a, b) => a - b);

    const action = label;
    const strike = {
      price: strikes.map((strike) => formatForDisplay({ value: strike, format: 'usd' })),
      side: null,
    };

    const token0 = d.find((a) => a.tokens.token0)?.tokens.token0;
    const token1 = d.find((a) => a.tokens.token1)?.tokens.token1;

    const size0 = formatUnits(
      BigInt(d.reduce((prev, curr) => prev + Number(curr.liquidity.amount0), 0)),
      token0?.decimals ?? 18,
    );
    const size1 = formatUnits(
      BigInt(d.reduce((prev, curr) => prev + Number(curr.liquidity.amount1), 0)),
      token1?.decimals ?? 18,
    );
    const timestamp = d[0].timestamp;
    const data = [
      {
        label: (
          <Typography variant={'small-regular'} className="text-muted-foreground">
            Total
          </Typography>
        ),
        value: (
          <span className="flex gap-x-1">
            <NumberDisplay value={Number(size0) + Number(size1) / strikes[0]} format="tokenAmount" />
            <Typography variant={'small-regular'} className="text-muted-foreground">
              {token0?.symbol}
            </Typography>
          </span>
        ),
      },
      {
        label: (
          <Typography variant={'small-regular'} className="text-muted-foreground">
            Strikes
          </Typography>
        ),
        value: <Typography variant={'small-regular'}>{d.length}</Typography>,
      },
    ];
    return {
      action,
      strike,
      size: [
        {
          amount: size0,
          symbol: token0?.symbol || 'N/A',
        },
        {
          amount: size1,
          symbol: token1?.symbol || 'N/A',
        },
      ],
      data,
      timestamp,
      txHash: d[0].txHash,
      chainId,
    };
  });
}

const useCoalescedHistory = (props: Props) => {
  const { user } = props;
  const { selectedMarket, quoteAssetPriceUsd, markPriceUsd } = useStrikesStore();
  const { pair, chainId, address } = selectedMarket;
  const period = useFilterStore((state) => state.period);

  const { data: purchases, isLoading: purchaseHistoryLoading } = useQuery({
    queryKey: ['trade-history/purchases', user, chainId, address, period],
    queryFn: async () =>
      await getHistoricPurchases({
        chainId,
        optionMarket: address ?? zeroAddress,
        first: 100,
        skip: 0,
        user,
      }),
    staleTime: 5_000,
  });
  const { data: exercises, isLoading: exerciseHistoryLoading } = useQuery({
    queryKey: ['trade-history/exercises', user, chainId, address, period],
    queryFn: async () =>
      await getHistoricExercises({
        chainId,
        user,
        first: 100,
        skip: 0,
        optionMarket: address ?? zeroAddress,
      }),
    staleTime: 5_000,
  });

  const { data: settlements, isLoading: settlementHistoryLoading } = useQuery({
    queryKey: ['trade-history/settlements', user, chainId, address, period],
    queryFn: async () =>
      await getHistoricSettlements({
        chainId,
        user,
        first: 100,
        skip: 0,
        optionMarket: address ?? zeroAddress,
      }),
    staleTime: 5_000,
  });

  const pools = useMemo(() => {
    if (!chainId || !selectedMarket || !address) return [];
    const _pools = (POOLS_BY_CHAIN_ID as { [key: number]: { [key: string]: string[] } })[chainId][
      address.toLowerCase()
    ];

    if (!_pools) return [];
    return _pools;
  }, [address, chainId, selectedMarket]) as Address[];

  const { data: deposits, isLoading: depositsHistoryLoading } = useQuery({
    queryKey: ['trade-history/deposits', user, chainId, pools, period],
    queryFn: async () => {
      const allDeposits = await Promise.all(
        pools.map((pool) =>
          getHistoricDeposits({
            chainId,
            user,
            first: 100,
            skip: 0,
            pool,
          }),
        ),
      );
      return allDeposits.flat();
    },
    staleTime: 5_000,
  });

  const { data: withdraws, isLoading: withdrawHistoryLoading } = useQuery({
    queryKey: ['trade-history/withdraws', user, chainId, pools],
    queryFn: async () => {
      const allWithdraws = await Promise.all(
        pools.map((pool) =>
          getHistoricWithdrawals({
            chainId,
            user,
            first: 100,
            skip: 0,
            pool,
          }),
        ),
      );
      return allWithdraws.flat();
    },
    staleTime: 5_000,
  });

  const coalesced: HistoryEntry[] = useMemo(() => {
    if (!purchases || !deposits || !withdraws || !exercises || !settlements) return [];

    const _purchases: HistoryEntry[] = purchases.map(
      ({ txHash, timestamp, size, strike, type, token, ttl, premium }) => ({
        action: 'Purchase',
        timestamp,
        size: [
          {
            amount: formatUnits(BigInt(size), token.decimals),
            symbol: token.symbol,
          },
        ],
        strike: {
          price: [<NumberDisplay key={strike} value={strike} format="usd" precision={4} />],
          side: type as 'put' | 'call',
        },
        data: [
          {
            label: (
              <Typography variant={'small-regular'} className="text-muted-foreground">
                Cost
              </Typography>
            ),
            value: (
              <span className="flex gap-x-1">
                <NumberDisplay value={Number(formatUnits(BigInt(premium), token.decimals))} format="tokenAmount" />
                <Typography variant={'small-regular'} className="text-muted-foreground">
                  {token.symbol}
                </Typography>
              </span>
            ),
          },
          {
            label: (
              <Typography variant={'small-regular'} className="text-muted-foreground">
                Expiry
              </Typography>
            ),
            value: EXPIRY_MAPPING[ttl],
          },
        ],
        txHash,
        chainId,
      }),
    );

    const _exercises: HistoryEntry[] = exercises.map(
      ({
        txHash,
        timestamp,
        type,
        size,
        sizeToken,
        strike,
        profit,
        profitToken,
        exercisePrice,
        premium,
        markPriceOnPurchase,
      }) => ({
        action: 'Exercise',
        timestamp: Number(timestamp),
        size: [
          {
            amount: formatUnits(BigInt(size), sizeToken.decimals),
            symbol: sizeToken.symbol,
          },
        ],
        strike: {
          price: [<NumberDisplay key={strike} value={strike} format="usd" precision={4} />],
          side: type as 'put' | 'call',
        },
        data: [
          {
            label: (
              <Typography variant={'small-regular'} className="text-muted-foreground">
                Profit
              </Typography>
            ),
            value: (
              <span className={`flex gap-x-1 ${Number(profit) > 0 ? 'text-success' : ''}`}>
                <NumberDisplay value={Number(formatUnits(BigInt(profit), profitToken.decimals))} format="tokenAmount" />
                <Typography variant={'small-regular'} className="text-muted-foreground">
                  {profitToken.symbol}
                </Typography>
              </span>
            ),
          },
          {
            label: (
              <Typography variant={'small-regular'} className="text-muted-foreground">
                Exercise Price
              </Typography>
            ),
            value: <NumberDisplay value={exercisePrice} format="usd" />,
          },
        ],
        txHash,
        chainId,
        shareDialogProps: {
          strikePriceUsd: strike,
          type,
          optionsAmount: Number(formatUnits(BigInt(size), sizeToken.decimals)),
          pnl: {
            pnlUsdValue:
              type === 'call'
                ? Number(formatUnits(BigInt(profit), profitToken.decimals)) * quoteAssetPriceUsd
                : Number(formatUnits(BigInt(profit), profitToken.decimals)) * markPriceUsd,

            pnlInQuoteAsset:
              type === 'call'
                ? Number(formatUnits(BigInt(profit), profitToken.decimals)) -
                  Number(formatUnits(BigInt(premium), pair?.[0].decimals)) * markPriceOnPurchase
                : Number(formatUnits(BigInt(profit), profitToken.decimals)) * exercisePrice -
                  Number(formatUnits(BigInt(premium), pair?.[1].decimals)),
          },
          premiumUsdValue:
            type === 'call'
              ? Number(formatUnits(BigInt(premium), pair?.[0].decimals)) * markPriceUsd
              : Number(formatUnits(BigInt(premium), pair?.[1].decimals)) * quoteAssetPriceUsd,
          premiumInQuoteAsset:
            type === 'call'
              ? Number(formatUnits(BigInt(premium), pair?.[0].decimals)) * markPriceOnPurchase
              : Number(formatUnits(BigInt(premium), pair?.[1].decimals)),
          exercisePriceUsd: exercisePrice,
        },
      }),
    );

    const _settlements: HistoryEntry[] = settlements.map(
      ({ transactionHash, type, size, sizeToken, strike, expiry }) => ({
        action: 'Expired',
        timestamp: expiry,
        size: [
          {
            amount: formatUnits(BigInt(size), sizeToken.decimals),
            symbol: sizeToken.symbol,
          },
        ],
        strike: {
          price: [<NumberDisplay key={strike} value={strike} format="usd" precision={4} />],
          side: type as 'put' | 'call',
        },
        data: [
          {
            label: (
              <Typography variant={'small-regular'} className="text-muted-foreground">
                Expiry
              </Typography>
            ),
            value: new Date(Number(expiry) * 1000).toLocaleString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
          },
        ],
        txHash: transactionHash,
        chainId,
      }),
    );
    const _deposits = _prettifyData(
      groupBy(
        deposits.map((d) => ({ ...d, chainId })),
        ({ txHash }) => txHash,
      ),
      'Deposit',
    );
    const _withdrawals = _prettifyData(
      groupBy(
        withdraws.map((d) => ({ ...d, chainId })),
        ({ txHash }) => txHash,
      ),
      'Withdraw',
    );

    const defaultTime = new Date();
    const result = _purchases.concat(_exercises).concat(_withdrawals).concat(_deposits).concat(_settlements);

    if (!period || !period.from || !period.to) return result;
    else
      return result.filter(
        (tx) =>
          tx.timestamp * 1000 >= (period.from || defaultTime).getTime() &&
          tx.timestamp * 1000 <= (period.to || defaultTime).getTime(),
      );
  }, [purchases, deposits, withdraws, exercises, settlements, period, chainId, quoteAssetPriceUsd, markPriceUsd, pair]);

  return {
    data: coalesced,
    isLoading:
      purchaseHistoryLoading ||
      exerciseHistoryLoading ||
      depositsHistoryLoading ||
      withdrawHistoryLoading ||
      settlementHistoryLoading,
  };
};

export default useCoalescedHistory;
