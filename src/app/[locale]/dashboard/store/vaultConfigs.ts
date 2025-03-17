import { BTC, ETH } from '@/assets/images';

export const VAULT_IDS = [
  'ETH Superbull Monthly',
  'BTC Superbull Monthly',
  'ETH Superbull Quarterly',
  'BTC Superbull Quarterly',
] as const;

export type VaultId = (typeof VAULT_IDS)[number];

export const VAULT_CONFIGS = {
  'ETH Superbull Monthly': {
    icon: ETH,
    symbol: 'WETH',
    type: 'SUPERBULL',
    duration: 'MONTHLY',
  },
  'BTC Superbull Monthly': {
    icon: BTC,
    symbol: 'WBTC',
    type: 'SUPERBULL',
    duration: 'MONTHLY',
  },
  'ETH Superbull Quarterly': {
    icon: ETH,
    symbol: 'WETH',
    type: 'SUPERBULL',
    duration: 'QUARTERLY',
  },
  'BTC Superbull Quarterly': {
    icon: BTC,
    symbol: 'WBTC',
    type: 'SUPERBULL',
    duration: 'QUARTERLY',
  },
} as const;
