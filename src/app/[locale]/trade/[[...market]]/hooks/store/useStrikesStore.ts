import type { MarketData, TokenData } from '@/types';

import { RefetchOptions } from '@tanstack/react-query';
import { Address } from 'viem';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StrikeDisplay {
  strikePrice: number;
  strikePriceUsd: number;
  isMemePair: boolean;
  circulatingSupply: number;
  availableLiquidity: {
    amountToken: number;
    amountUSD: number;
    amountTokenBigInt: bigint;
  };
  availableLiquidityWeekly: {
    amountTokenBigInt: bigint;
    amountToken: number;
    amountUSD: number;
  };
  totalLiquidity: {
    amountToken: number;
    amountUSD: number;
  };
  utilization: number;
  feeApr: number;
  token: {
    symbol: string;
    address: string;
    decimals: number;
  };
  tickLower: number;
  tickUpper: number;
  hook: string;
  callToken: TokenData;
  putToken: TokenData;
  handlersLiquidityData: {
    totalLiquidity: bigint;
    availableLiquidity: bigint;
    availableTokenLiquidity: bigint;
    tickLower: number;
    tickUpper: number;
    name: string;
    handler: `0x${string}`;
    pool: `0x${string}`;
    hook: string;
  }[];
  handlersLiquidityDataWeekly: StrikeDisplay['handlersLiquidityData'];
  primePool: Address;
  chainId: number;
  incentivized: boolean;
}

export type FilterSettings = {
  minStrike: number;
  maxStrike: number;
  usdThreshold: number;
  optionsAmountThreshold: number;
  liquidityThresholdType: 'weekly' | 'intraday';
};

export enum TradingDetailTabs {
  OptionsChain = 'OptionsChain',
  BuyPositions = 'BuyPositions',
  LPPositions = 'LPPositions',
  TradeHistory = 'TradeHistory',
}

// TODO: break this store into smaller stores => one for data, one for UI state
interface StrikesStore {
  isStrikesChainLoading: boolean;
  setIsStrikesChainLoading: (loading: boolean) => void;
  filterSettings: Record<string, FilterSettings>;
  setFilterSettings: (marketAddress: string, settings: FilterSettings) => void;
  isChartCollapsed: boolean;
  setChartCollapsed: (isChartCollapsed: boolean) => void;
  strikes: StrikeDisplay[];
  setStrikes: (strikes: StrikeDisplay[]) => void;
  displayStrikesAsMarketCap: boolean;
  setDisplayStrikesAsMarketCap: (displayStrikesAsMarketCap: boolean) => void;
  markPrice: number;
  markPriceUsd: number;
  quoteAssetPriceUsd: number;
  tick: number;
  setMarkPrice: (markPrice: number) => void;
  setMarkPriceUsd: (markPriceUsd: number) => void;
  setQuoteAssetPriceUsd: (quoteAssetPriceUsd: number) => void;
  setTick: (tick: number) => void;
  selectedStrikes: number[];
  setSelectedStrikes: (selectedStrikes: number[]) => void;
  refetchStrikesData: (opts?: RefetchOptions) => void;
  setRefetchStrikesData: (refetchStrikesData: (opts?: RefetchOptions) => void) => void;
  selectedMarket: MarketData;
  setSelectedMarket: (selectedMarket: MarketData) => void;
  activeTradingDetailTab: TradingDetailTabs;
  setActiveTradingDetailTab: (activeTradingDetailTab: TradingDetailTabs) => void;
}

const useStrikesStore = create<StrikesStore>()(
  persist(
    (set, get) => ({
      isStrikesChainLoading: false,
      setIsStrikesChainLoading: (loading) => {
        set({
          isStrikesChainLoading: loading,
        });
      },
      filterSettings: {},
      setFilterSettings: (marketAddress, settings) => {
        const newSettings = { ...get().filterSettings, [marketAddress]: settings };
        set({ filterSettings: newSettings });
      },
      strikes: [],
      setStrikes: (strikes) => set({ strikes }),
      displayStrikesAsMarketCap: false,
      setDisplayStrikesAsMarketCap: (displayStrikesAsMarketCap) => set({ displayStrikesAsMarketCap }),
      markPrice: 0,
      markPriceUsd: 0,
      quoteAssetPriceUsd: 0,
      tick: 0,
      setMarkPrice: (markPrice) => set({ markPrice }),
      setMarkPriceUsd: (markPriceUsd) => set({ markPriceUsd }),
      setQuoteAssetPriceUsd: (quoteAssetPriceUsd) => set({ quoteAssetPriceUsd }),
      setTick: (tick) => set({ tick }),
      selectedStrikes: [],
      setSelectedStrikes: (selectedStrikes) => set({ selectedStrikes }),
      refetchStrikesData: () => {},
      setRefetchStrikesData: (refetchStrikesData) => set({ refetchStrikesData }),
      selectedMarket: {} as MarketData,
      setSelectedMarket: (selectedMarket) => set({ selectedMarket }),
      isChartCollapsed: false,
      setChartCollapsed: (isChartCollapsed) => set({ isChartCollapsed }),
      activeTradingDetailTab: TradingDetailTabs.OptionsChain,
      setActiveTradingDetailTab: (activeTradingDetailTab) => set({ activeTradingDetailTab }),
    }),
    {
      name: 'strikes-store-settings',
      partialize: (state) => ({ filterSettings: state.filterSettings, isChartCollapsed: state.isChartCollapsed }),
    },
  ),
);

export default useStrikesStore;
