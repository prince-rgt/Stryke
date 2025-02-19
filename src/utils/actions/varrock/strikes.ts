'use client';

import { Strikes } from '@/types/varrock';

import { StrikesChainRequestDto } from '@stryke-xyz/shared-types';
import axios from 'axios';

import { VARROCK_BASE_API_URL } from '@/consts/env';

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
