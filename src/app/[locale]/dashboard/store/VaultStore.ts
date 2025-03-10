import { create } from 'zustand';

interface VaultState {
  selectedVaultId: string | null;
  setSelectedVaultId: (id: string) => void;
  clearSelectedVault: () => void;
}

const useVaultStore = create<VaultState>((set) => ({
  selectedVaultId: null,
  setSelectedVaultId: (id) => set({ selectedVaultId: id }),
  clearSelectedVault: () => set({ selectedVaultId: null }),
}));

export default useVaultStore;
