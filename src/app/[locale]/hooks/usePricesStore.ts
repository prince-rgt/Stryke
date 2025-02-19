import { create } from 'zustand';

interface PriceStoreState {
  prices: Map<string, number>;
  setPrices: (prices: Map<string, number>) => void;
}

export const usePricesStore = create<PriceStoreState>((set) => ({
  prices: new Map(),
  setPrices: (prices) => set({ prices }),
}));
