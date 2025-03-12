import { create } from 'zustand';

import getVaultDetails, { VaultDetails } from '@/utils/actions/varrock/getVaultDetails';

export const VAULT_ADDRESSES: Record<string, `0x${string}`> = {
  'ETH Superbull Monthly': '0x8CB9f8DF367743Dd5b6c20B9e22E4f2FC7CDc16C',
  'BTC Superbull Monthly': '0x2303fA4f215adBB41b4c08c49Ab59FDC4A249bCA',
  'ETH Superbull Quarterly': '0xCD0AF564E47AB822A548C37f1C35e1Fdce8f66C0',
  'BTC Superbull Quarterly': '0x8133CDd185e91578d0204A16896fbFf3BE682394',
};

interface VaultState {
  userAddress: `0x${string}` | null;
  selectedVaultId: string | null;
  vaultDetails: Record<string, VaultDetails | null>;
  loading: boolean;
  error: string | null;

  setUserAddress: (address: `0x${string}` | null) => void;
  setSelectedVaultId: (id: string) => void;
  clearSelectedVault: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  getSelectedVaultAddress: () => `0x${string}` | null;
  getSelectedVaultDetails: () => Promise<VaultDetails>;
}

const useVaultStore = create<VaultState>((set, get) => ({
  userAddress: null,
  selectedVaultId: null,
  vaultDetails: {},
  loading: false,
  error: null,
  setUserAddress: (address) => set({ userAddress: address }),
  setSelectedVaultId: (id) => set({ selectedVaultId: id }),
  clearSelectedVault: () => set({ selectedVaultId: null }),

  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (error) => set({ error }),

  getSelectedVaultAddress: () => {
    const { selectedVaultId } = get();
    return selectedVaultId ? VAULT_ADDRESSES[selectedVaultId] : null;
  },

  getSelectedVaultDetails: async () => {
    const { selectedVaultId, userAddress } = get();
    const vaultAddress = selectedVaultId ? VAULT_ADDRESSES[selectedVaultId] : null;
    const vaultDetails = await getVaultDetails(vaultAddress as `0x${string}`, userAddress as `0x${string}`);
    console.log('vaultDetails', vaultDetails);
    return vaultDetails;
  },
}));

export default useVaultStore;
