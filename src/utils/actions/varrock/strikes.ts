'use client';

import { Strikes } from '@/types/varrock';

import axios from 'axios';

import { VARROCK_BASE_API_URL } from '@/consts/env';

export interface StrikesChainRequestDto {
  callsReach: number;
  putsReach: number;
  chainId: 8453 | 5000 | 42161 | 81457 | 80084 | 146 | 421614;
  optionMarket: `0x${string}`;
}
const getStrikesChain = async ({
  chainId,
  optionMarket,
  callsReach,
  putsReach,
}: StrikesChainRequestDto): Promise<Strikes> => {
  return await axios
    .get(
      `${VARROCK_BASE_API_URL}/clamm/strikes-chain?chainId=${chainId}&optionMarket=${optionMarket}&callsReach=${callsReach}&putsReach=${putsReach}&filterDeprecated=true`,
    )
    .then((res) => res.data)
    .catch(() => []);
};

export default getStrikesChain;
