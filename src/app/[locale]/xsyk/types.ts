import { TokenData } from '@/types';
import { VestPosition } from '@/types/varrock';

import { SUPPORTED_XSYK_CHAINS } from './consts';

export type VestEntry = {
  button: {
    label: string;
    action: () => Promise<void>;
    disabled: boolean;
  };
} & Omit<VestPosition, 'account' | 'transactionHash'>;

export type SupportedXsykChain = (typeof SUPPORTED_XSYK_CHAINS)[number];

export type UserVestDataReturnType = (
  | {
      error?: undefined;
      result: readonly [bigint, bigint, bigint, bigint, number];
      status: 'success';
    }
  | {
      error: Error;
      result?: undefined;
      status: 'failure';
    }
)[];

export type Earnings = TokenData & { amount: bigint };
