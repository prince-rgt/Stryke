import {
  DepositHistoryResponseDto,
  DepositPositionsResponseDto,
  ExerciseHistoryResponseDto,
  PnlDeltaResponseDto,
  PurchaseHistoryResponseDto,
  PurchasePositionsResponseDto,
  QuoteResponseDto,
  StrikesChainDto,
  TokenDto,
  VestPositionsResponseDto,
  WithdrawHistoryResponseDto,
} from '@stryke-xyz/shared-types';

export interface OptionMarketsResponseDtoV2 {
  chainId: 8453 | 5000 | 42161 | 81457 | 80084 | 146 | 421614;
  pools: any;
  feeStrategy: `0x${string}`;
  premiums24h: number;
  volume24h: number;
  protocolFees24h: number;
  totalLiquidity: number;
  availableLiquidity: number;
  openInterest: number;
  deprecated: boolean;
  address: `0x${string}`;
  callToken: TokenDto;
  putToken: TokenDto;
  isLimitOrdersEnabled: boolean;
  primePool: `0x${string}`;
  optionsPricing: `0x${string}`;
  tokenURIFetcher: `0x${string}`;
  pairName: string;
  ticker: string;
}
export type OptionMarket = OptionMarketsResponseDtoV2 & { tickSpacing: number; isLimitOrdersEnabled: boolean };

export type Strikes = { [key in number]: StrikesChainDto[] }[];

interface DepositMeta {
  shares: string;
  withdrawableLiquidity: string;
  hook: string;
  tokenId: string;
  initialLiquidity: string;
  reservedLiquidity: string;
  newLiquidity: string;
  tickLower: number;
  tickUpper: number;
  handler: {
    name: string;
    deprecated: boolean;
    handler: string;
    pool: string;
  };
  withdrawTx: string;
}

export type Deposit = DepositPositionsResponseDto & { meta: DepositMeta };
export type Purchase = PurchasePositionsResponseDto & {
  sellOrder: any;
  isLimitOrdersEnabled: boolean;
};

export type HistoricDeposit = DepositHistoryResponseDto;
export type HistoricPurchase = PurchaseHistoryResponseDto;
export type HistoricExercise = ExerciseHistoryResponseDto;
export type HistoricWithdraw = WithdrawHistoryResponseDto;

export type PurchaseQuote = QuoteResponseDto;

export type PnlDelta = PnlDeltaResponseDto;

export type VestPosition = VestPositionsResponseDto; // xSYK
