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
  vaultAddress: `0x${string}` | null;
  selectedVaultId: string | null;
  vaultDetails: VaultDetails;
  loading: boolean;
  error: string | null;

  setUserAddress: (address: `0x${string}` | null) => void;
  setSelectedVaultId: (id: string) => void;
  clearSelectedVault: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  getSelectedVaultAddress: () => `0x${string}` | null;
  getSelectedVaultDetails: () => Promise<VaultDetails>;
  updateVault: () => Promise<void>;
}

const useVaultStore = create<VaultState>((set, get) => ({
  userAddress: null,
  vaultAddress: null,
  selectedVaultId: null,
  vaultDetails: {
    name: '',
    symbol: '',
    decimals: 18,
    totalSupply: '0',
    userBalance: '0',
    userBalanceInAssets: '0',
    userAllowance: '0',
    asset: '0x0000000000000000000000000000000000000000',
    assetName: '',
    assetSymbol: '',
    assetDecimals: 18,
    assetUserBalance: '0',
    assetUserAllowance: '0',
    totalAssets: '0',
    depositsPaused: false,
    withdrawalsPaused: false,
    currentEpoch: 0n,
    epochDuration: '0',
    maxBorrow: '0',
    yearnVaultAddress: '',
    currentEpochData: {
      startTime: null,
      endTime: null,
      isSettled: false,
      isActive: false,
      initialVaultAssets: '0',
      initialYearnDeposits: '0',
      initialUnutilizedAsset: '0',
      currentYearnDeposits: '0',
      currentUnutilizedAsset: '0',
      fundsBorrowed: '0',
      finalVaultAssets: '0',
      yearnPnl: 0,
      tradingPnl: '0',
    },
  } as VaultDetails,
  loading: false,
  error: null,
  setUserAddress: (address) => set({ userAddress: address }),
  setSelectedVaultId: async (id) => {
    set({ selectedVaultId: id });
    const { userAddress } = get();
    const vaultAddress = id ? VAULT_ADDRESSES[id] : null;
    set({ vaultAddress: vaultAddress });
    const vaultDetails = await getVaultDetails(vaultAddress as `0x${string}`, userAddress as `0x${string}`);
    set({ vaultDetails: vaultDetails });
  },
  clearSelectedVault: () => set({ selectedVaultId: null }),

  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (error) => set({ error }),

  getSelectedVaultAddress: () => {
    const { selectedVaultId } = get();
    return selectedVaultId ? VAULT_ADDRESSES[selectedVaultId] : null;
  },

  getSelectedVaultDetails: async () => {
    const { userAddress, vaultAddress } = get();
    const vaultDetails = await getVaultDetails(vaultAddress as `0x${string}`, userAddress as `0x${string}`);
    return vaultDetails;
  },
  updateVault: async () => {
    const { userAddress, vaultAddress } = get();
    const vaultDetails = await getVaultDetails(vaultAddress as `0x${string}`, userAddress as `0x${string}`);
    set({ vaultDetails: vaultDetails });
  },
}));

export default useVaultStore;
