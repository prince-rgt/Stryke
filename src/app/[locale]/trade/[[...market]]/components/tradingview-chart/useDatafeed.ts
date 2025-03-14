import type {
  ErrorCallback,
  HistoryCallback,
  LibrarySymbolInfo,
  OnReadyCallback,
  PeriodParams,
} from '@/../../public/charting_library';
import { BUILD_APP_NAMES, SupportedChainIdType } from '@/types';

import {
  Bar,
  DatafeedConfiguration,
  ResolutionString,
  ResolveCallback,
  SubscribeBarsCallback,
  SymbolResolveExtension,
} from '@/../../public/charting_library';
import { useMemo, useRef } from 'react';
import { arbitrum, arbitrumSepolia, base, berachainTestnetbArtio, blast, Chain, mantle, sonic } from 'viem/chains';

import { RESOLUTION_TO_VARROCK_INTERVAL } from '@/app/[locale]/trade/[[...market]]/components/tradingview-chart/consts';

import { AMMs } from '@/consts/clamm';
import { BUILD_APP_NAME } from '@/consts/env';

import Datafeed from './datafeed.class';

const pairToExchange: {
  [chainId in SupportedChainIdType]: {
    [pair: string]: AMMs;
  };
} = {
  [arbitrum.id]: {
    'ARB/USDC': AMMs.UNISWAP,
    'WETH/USDC': AMMs.UNISWAP, // use uniswap prices for pcs as well
    'WBTC/USDC': AMMs.UNISWAP,
    'BOOP/WETH': AMMs.UNISWAP,
    'ARB/USDC.e': AMMs.UNISWAP,
    'WETH/USDC.e': AMMs.UNISWAP,
    'WBTC/USDC.e': AMMs.UNISWAP,
  },
  [arbitrumSepolia.id]: {
    'DEGEN/WETH': AMMs.UNISWAP,
  },
  [base.id]: {
    'DEGEN/WETH': AMMs.UNISWAP,
    'BRETT/WETH': AMMs.UNISWAP,
    'WETH/USDC': AMMs.AERODROME,
    'cbBTC/USDC': AMMs.AERODROME,
  },
  [berachainTestnetbArtio.id]: {
    'WBERA/HONEY': AMMs.KODIAK,
    'HONEY/USDC': AMMs.KODIAK,
  },
  [mantle.id]: {
    'WMNT/USDT': AMMs.FUSION_X,
    'WETH/USDT': AMMs.AGNI,
  },
  [blast.id]: {
    'BLAST/USDB': AMMs.THRUSTER,
  },
  [sonic.id]: {
    'WS/USDC.e': AMMs.EQUALIZER,
    'WETH/USDC.e': AMMs.EQUALIZER,
  },
};

const configuration: DatafeedConfiguration = {
  currency_codes: [],
  exchanges: [
    {
      desc: 'Uniswap',
      name: 'Uniswap',
      value: 'uniswap',
    },
  ],
  supported_resolutions: Object.keys(RESOLUTION_TO_VARROCK_INTERVAL) as ResolutionString[],
  supports_marks: false,
  supports_time: true,
  supports_timescale_marks: false,
  symbols_grouping: {},
  symbols_types: [],
  units: undefined,
};

type Props = {
  chainId: SupportedChainIdType;
};

const isPCS = BUILD_APP_NAME === BUILD_APP_NAMES.PANCAKESWAP;

const useDatafeed = ({ chainId }: Props) => {
  const resetCacheRef = useRef<() => void | undefined>();
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>();

  const dataInstance = useMemo(() => new Datafeed(), []);

  const datafeed = useMemo(
    () => ({
      onReady: (callback: OnReadyCallback) => {
        // console.log(callback, 'onReady() invoked');
        setTimeout(() => callback(configuration));
      },
      resolveSymbol: (
        symbolName: string,
        onSymbolResolvedCallback: ResolveCallback,
        onResolveErrorCallback: ErrorCallback,
        extension: SymbolResolveExtension,
      ) => {
        if (!Object.keys(pairToExchange[chainId]).includes(symbolName)) {
          onResolveErrorCallback('Cannot resolve symbol');
          return;
        }

        let exchange = isPCS ? 'pancakeswap' : (pairToExchange[chainId][symbolName] ?? 'uniswap');

        const symbolInfo: LibrarySymbolInfo = {
          name: symbolName,
          type: 'crypto',
          description: symbolName,
          ticker: symbolName,
          session: '24x7',
          minmov: 1,
          pricescale: 1000000,
          timezone: 'Etc/UTC',
          has_intraday: true,
          has_daily: false,
          currency_code: 'USD',
          visible_plots_set: 'ohlc',
          data_status: 'streaming',
          full_name: 'uniswap-prices',
          exchange: exchange[0].toUpperCase().concat(exchange.slice(1)),
          listed_exchange: 'Uniswap',
          format: 'price',
          supported_resolutions: ['5', '15', '60', '240'] as ResolutionString[], // @note might cause issues
        };
        setTimeout(() => onSymbolResolvedCallback(symbolInfo));
      },
      getBars: async (
        symbolInfo: LibrarySymbolInfo,
        resolution: ResolutionString,
        periodParams: PeriodParams,
        onResult: HistoryCallback,
        onError: ErrorCallback,
      ) => {
        const { from, to, firstDataRequest } = periodParams;

        const [varrockResolution, _] = RESOLUTION_TO_VARROCK_INTERVAL[resolution];
        const ticker = symbolInfo.name.toUpperCase();

        let priceCandles = await dataInstance.getOHLC(chainId, ticker, varrockResolution, from, to).catch((e) => {
          // console.log('[getBars]: Get error', e);
          onError(String(e));
        });

        let bars: Omit<Bar, 'volume'>[] = [];
        if (priceCandles) {
          priceCandles.forEach((bar: Bar) => {
            if (bar.time >= from && bar.time < to) {
              bars = [
                ...bars,
                {
                  time: bar.time * 1000,
                  low: bar.low,
                  high: bar.high,
                  open: bar.open,
                  close: bar.close,
                },
              ];
            }
          });
        }

        if (firstDataRequest) {
          dataInstance.saveBars(bars);
          dataInstance.setLastBar(bars[bars.length - 1]);
        }

        onResult(bars, { noData: !bars || bars.length === 0 });
      },
      subscribeBars: (
        symbolInfo: LibrarySymbolInfo,
        resolution: ResolutionString,
        onTick: SubscribeBarsCallback,
        _: string,
        onResetCacheNeededCallback: () => void,
      ) => {
        resetCacheRef.current = onResetCacheNeededCallback;
        intervalRef.current = setInterval(async () => {
          let lastBar = dataInstance.lastBar;
          const [_, interval] = RESOLUTION_TO_VARROCK_INTERVAL[resolution];
          if (!lastBar) return;
          const nextBarTime = lastBar.time + interval * 1000;
          const currentTime = new Date().getTime();
          const ticker = symbolInfo.name;
          let lastPrice = await dataInstance.getLastPrice(chainId, ticker);

          if (lastPrice === 0) lastPrice = lastBar.close;

          let bar;

          if (currentTime >= nextBarTime) {
            bar = {
              time: nextBarTime,
              open: lastPrice,
              high: lastPrice,
              low: lastPrice,
              close: lastPrice,
            };
            onTick(bar);
          } else {
            bar = {
              ...lastBar,
              high: Math.max(lastBar.high, lastPrice),
              low: Math.min(lastBar.low, lastPrice),
              close: lastPrice,
            };
            onTick(bar);
          }
          dataInstance.setLastBar(bar);
        }, 5000);
      },
      unsubscribeBars: (subscriberUID: any) => {
        // console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
        intervalRef.current && clearInterval(intervalRef.current);
      },
    }),
    [dataInstance, chainId],
  );

  return {
    datafeed,
    dataInstance,
    resetCache: resetCacheRef?.current,
  };
};

export default useDatafeed;
