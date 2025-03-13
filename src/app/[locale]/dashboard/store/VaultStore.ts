import { create } from 'zustand';

import getVaultDetails, { VaultDetails } from '@/utils/actions/varrock/getVaultDetails';

export const VAULT_ADDRESSES: Record<string, `0x${string}`> = {
  'ETH Superbull Monthly': '0xb4E413fA5B465d56C60161b60288e343F1819Df1',
  'BTC Superbull Monthly': '0x7A2F19F9A5e70D1AcbD1B8a8E8052aD4F5f9b0B8',
  'ETH Superbull Quarterly': '0xCCa447869f8Ff32e4fc806d8C09C11C4c7C76e1f',
  'BTC Superbull Quarterly': '0x5CA5Aa9cA6D071D9555768A8C29C725F1CE3EE10',
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
    return vaultDetails;
  },
}));

export default useVaultStore;
