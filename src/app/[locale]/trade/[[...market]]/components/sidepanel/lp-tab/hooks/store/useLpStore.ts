import { create } from 'zustand';

import { AMMs, SupportedTTLs } from '@/consts/clamm';

interface Token {
  address: string;
  decimals: number;
  symbol: string;
}

export interface InputValue {
  token: Token;
  amount: bigint;
  tickLower: number;
  tickUpper: number;
}
interface TradeState {
  errors: Map<number, string> | undefined;
  inputValues: Map<number, InputValue>;
  selectedAMM: AMMs;
  ttl: SupportedTTLs;
  setTTL: (ttl: SupportedTTLs) => void;
  setSelectedAMM: (amm: AMMs) => void;
  setErrors: (errors: Map<number, string> | undefined) => void;
  setInputValue: (vstrike: number, input: InputValue) => void;
  setInputValues: (newInputValues: Map<number, InputValue>) => void;
  unsetInputValue: (strike: number) => void;
  resetInputValues: () => void;
}

export const useLpStore = create<TradeState>((set) => ({
  errors: undefined,
  inputValues: new Map(),
  selectedAMM: AMMs.UNISWAP,
  ttl: SupportedTTLs.WEEKLY,
  setTTL: (ttl) => set({ ttl }),
  setSelectedAMM: (amm) => set({ selectedAMM: amm }),
  setInputValues: (newInputValues) => set({ inputValues: newInputValues }),
  setErrors: (errors) => set({ errors }),
  setInputValue: (strike, value) =>
    set((state) => {
      // console.trace('setInputValue', strike, value);
      return {
        inputValues: new Map(state.inputValues).set(strike, value),
      };
    }),
  unsetInputValue: (strike) =>
    set((state) => {
      // console.trace('unsetInputValue', strike);
      const inputValues = new Map(state.inputValues);
      inputValues.delete(strike);
      return { inputValues };
    }),
  resetInputValues: () => set({ inputValues: new Map() }),
}));
