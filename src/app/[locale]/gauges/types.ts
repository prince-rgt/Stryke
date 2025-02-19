import { Address } from 'viem';

import { SUPPORTED_GAUGE_CHAINS } from './consts';

export type SupportedGaugeControllerChain = (typeof SUPPORTED_GAUGE_CHAINS)[number];

export type GaugeData = {
  name: string;
  logoURI: string[];
  address: Address;
  chainId: SupportedGaugeControllerChain;
};

export type RowData = {
  name: string;
  logo: string[];
  weight: bigint;
  rewards: bigint | null;
  userWeight: bigint | null;
  share: number;
  chain: number;
  epoch: bigint;
  address: Address;
};
