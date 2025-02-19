'use server';

import { GetUsersDeltaBoundedReturnType, PnlDeltaRequestBoundedDto } from '@/app/[locale]/leaderboard/types';
import axios from 'axios';
import { Address } from 'viem';

import { VARROCK_BASE_API_URL } from '@/consts/env';

export async function getPnlDeltaBounded<T extends Address | undefined = undefined>(
  params: PnlDeltaRequestBoundedDto<T> & { user?: T },
): Promise<GetUsersDeltaBoundedReturnType<T> | null> {
  const { user = undefined, period, chainId } = params;

  const _params = {
    chainId,
    period,
  };

  if (user) {
    return axios
      .get(`${VARROCK_BASE_API_URL}/clamm/stats/delta-bounded-user`, {
        params: { ..._params, user },
      })
      .then(({ data }) => {
        return data as GetUsersDeltaBoundedReturnType<T>;
      })
      .catch((err) => {
        console.error(err);
        return null;
      });
  } else {
    return axios
      .get(`${VARROCK_BASE_API_URL}/clamm/stats/delta-bounded-all`, {
        params: { ..._params },
      })
      .then(({ data }) => {
        return data as GetUsersDeltaBoundedReturnType<T>;
      })
      .catch((err) => {
        console.error(err);
        return null;
      });
  }
}
