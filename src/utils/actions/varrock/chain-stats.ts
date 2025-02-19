'use server';

import axios from 'axios';

import { VARROCK_BASE_API_URL } from '@/consts/env';

export async function getTotalVolumeForChain(chainId: number): Promise<number | null> {
  return axios
    .get<number>(`${VARROCK_BASE_API_URL}/clamm/stats/total-volume`, {
      params: { chainId },
    })
    .then(({ data }) => {
      return data;
    })
    .catch((err) => {
      console.error(err);
      return null;
    });
}
