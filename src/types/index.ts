import { RowData } from '@tanstack/react-table';
import { Address } from 'viem';

import { SUPPORTED_CHAIN_IDS } from '@/consts/chains';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    displayStrikesAsMarketCap?: boolean;
    refetchBuyPositions?: () => void;
    showNonExercisablePositionToast?: () => void;
    avgRewardAPR?: number;
    yourAddress?: Address;
  }
}

export type Env = {
  NEXT_PUBLIC_DRPC_API_KEY: string;
  NEXT_PUBLIC_DEFAULT_CHAIN_ID: SupportedChainIdType;
  NEXT_PUBLIC_VARROCK_API_BASE_URL: string;
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: string;
  NEXT_PUBLIC_AUTH_BEARER_TOKEN: string;
  NEXT_PUBLIC_GAUGES_SUBGRAPH_URL: string;
  NEXT_PUBLIC_SPINDL_SDK_KEY: string;
  NEXT_PUBLIC_ACTIVATE_SPINDL: string;
  NODE_ENV: string;
  NEXT_PUBLIC_CLOUDINARY_API_KEY: string;
  NEXT_PUBLIC_TENDERLY_ACCOUNT_SLUG: string;
  NEXT_PUBLIC_TENDERLY_PROJECT_SLUG: string;
  NEXT_PUBLIC_BUILD_APP_NAME: BUILD_APP_NAMES;
};

export enum BUILD_APP_NAMES {
  STRYKE = 'STRYKE',
  KODIAK = 'KODIAK',
  PANCAKESWAP = 'PANCAKESWAP',
  BERACHAIN_TESTNET = 'BERACHAIN_TESTNET',
}

export type SupportedChainIdType = (typeof SUPPORTED_CHAIN_IDS)[number];

export type TokenData = {
  address: Address;
  chainId: SupportedChainIdType;
  symbol: string;
  name: string;
  logoURI: string;
  decimals: number;
};

export type MarketData = {
  pair: [TokenData, TokenData];
  deprecated: boolean;
  address: Address;
  liquidity: { availableLiquidity: number; totalLiquidity: number };
  openInterest: number;
  utilization: number;
  volume24h: number;
  totalEarnings: number;
  chainId: SupportedChainIdType;
  chainName: string;
  pairLabel: string;
  optionsPricing: Address;
  primePool: Address;
  isMemePair: boolean;
  circulatingSupply: number;
  earningsApr: { low: number; high: number };
  tickSpacing: number;
  isLimitOrdersEnabled: boolean;
};
