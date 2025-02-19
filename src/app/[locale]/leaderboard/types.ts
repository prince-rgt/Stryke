import { Address } from 'viem';

import { TimeFrame } from './consts';

export type PnlDeltaRequestBoundedDto<T> = {
  user?: T;
  period: TimeFrame;
  chainId: number;
};

export type UserPnlResponseDto = {
  user: Address;
  lastTradeTimestamp: number;
  firstTradeTimestamp: number;
  roi: number;
  premiumPaid: number;
  totalOptionsBought: number;
  volume: number;
  pnl: number;
};

export type GetUsersDeltaBoundedReturnType<T extends Address | undefined> = T extends Address
  ? UserPnlResponseDto
  : UserPnlResponseDto[];
