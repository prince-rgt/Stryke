import {
  DepositHistoryResponseDto,
  DepositPositionsResponseDto,
  ExerciseHistoryResponseDto,
  OptionMarketsResponseDtoV2,
  PnlDeltaResponseDto,
  PurchaseHistoryResponseDto,
  PurchasePositionsResponseDto,
  QuoteResponseDto,
  StrikesChainDto,
  VestPositionsResponseDto,
  WithdrawHistoryResponseDto,
} from '@stryke-xyz/shared-types';

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
