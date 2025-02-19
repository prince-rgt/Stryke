import { create } from 'zustand';

export enum ExpiryOption {
  OneHour = '1H',
  TwoHours = '2H',
  SixHours = '6H',
  TwelveHours = '12H',
  OneDay = '24H',
  OneWeek = '1W',
}

// Mapping of expiry options to their TTL in seconds
export const EXPIRIES: { [key in ExpiryOption]: number } = {
  [ExpiryOption.OneHour]: 3600,
  [ExpiryOption.TwoHours]: 7200,
  [ExpiryOption.SixHours]: 21600,
  [ExpiryOption.TwelveHours]: 43200,
  [ExpiryOption.OneDay]: 86400,
  [ExpiryOption.OneWeek]: 604800,
};

export const TTL_TO_EXPIRY: { [key in number]: ExpiryOption } = {
  3600: ExpiryOption.OneHour,
  7200: ExpiryOption.TwoHours,
  21600: ExpiryOption.SixHours,
  43200: ExpiryOption.TwelveHours,
  86400: ExpiryOption.OneDay,
  604800: ExpiryOption.OneWeek,
};

interface Token {
  address: string;
  decimals: number;
  symbol: string;
}

interface InputValue {
  token: Token;
  amount: bigint;
}

export type PurchaseMeta = {
  fees: string;
  premium: string;
  token: Token;
};

interface TradeState {
  selectedTTL: number;
  errors: Map<number, string> | undefined;
  inputValues: Map<number, InputValue> | undefined;
  purchaseMetaByStrike: Map<number, PurchaseMeta>;
  fetchingQuotes: boolean;
  totalCostUsd: number;
  setTotalCostUsd: (totalCostUsd: number) => void;
  setSelectedTTL: (ttl: number) => void;
  setErrors: (errors: Map<number, string> | undefined) => void;
  setInputValue: (vstrike: number, input: InputValue) => void;
  unsetInputValue: (strike: number) => void;
  resetInputValues: () => void;
  setPurchaseMetaByStrike: (strike: number, data: PurchaseMeta) => void;
  unsetPurchaseMetaByStrike: (strike: number) => void;
  setFetchingQuotes: (fetchingQuotes: boolean) => void;
}

export const useTradeStore = create<TradeState>((set) => ({
  selectedTTL: EXPIRIES[ExpiryOption.OneDay],
  errors: undefined,
  inputValues: new Map(),
  purchaseMetaByStrike: new Map(),
  fetchingQuotes: false,
  totalCostUsd: 0,
  setTotalCostUsd: (totalCostUsd) => set({ totalCostUsd }),
  setSelectedTTL: (ttl) => set({ selectedTTL: ttl }),
  setErrors: (errors) => set({ errors }),
  setInputValue: (strike, value) =>
    set((state) => {
      return {
        inputValues: new Map(state.inputValues).set(strike, value),
      };
    }),
  unsetInputValue: (strike) =>
    set((state) => {
      const inputValues = new Map(state.inputValues);
      inputValues.delete(strike);
      return { inputValues };
    }),
  resetInputValues: () => set({ inputValues: new Map() }),
  setPurchaseMetaByStrike: (strike, data) =>
    set((state) => ({
      purchaseMetaByStrike: new Map(state.purchaseMetaByStrike).set(strike, data),
    })),
  unsetPurchaseMetaByStrike: (strike) =>
    set((state) => {
      const purchaseMetaByStrike = new Map(state.purchaseMetaByStrike);
      purchaseMetaByStrike.delete(strike);
      return { purchaseMetaByStrike };
    }),
  setFetchingQuotes: (fetchingQuotes) => set({ fetchingQuotes }),
}));
