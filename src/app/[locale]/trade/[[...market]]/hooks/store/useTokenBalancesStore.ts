import { create } from 'zustand';

interface TokenBalancesStore {
  refetchTokenBalances: () => void;
  setRefetchTokenBalances: (refetchTokenBalances: () => void) => void;
}

const useTokenBalancesStore = create<TokenBalancesStore>((set) => ({
  refetchTokenBalances: () => null,
  setRefetchTokenBalances: (refetchTokenBalances) => set({ refetchTokenBalances }),
}));

export default useTokenBalancesStore;
