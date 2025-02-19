'use client';

import { LogRequestDto } from '@stryke-xyz/shared-types';
import axios from 'axios';

import { AUTH_BEARER_TOKEN, VARROCK_BASE_API_URL } from '@/consts/env';

export default async function logPurchase(params: LogRequestDto) {
  if (params.hash) console.log('executed');
  else console.log('not executed');

  if (params.hash) {
    return await axios
      .post(
        `${VARROCK_BASE_API_URL}/clamm/purchase-logs/log-stryke`,
        {
          ...params,
        },
        {
          headers: {
            Authorization: `Bearer ${AUTH_BEARER_TOKEN}`,
          },
        },
      )
      .then((res) => {
        return { message: res.statusText, value: res.data as boolean };
      })
      .catch((e: Error) => {
        return {
          message: e.message,
          value: false,
        };
      });
  } else throw Error('Failed to log stryke purchase...');
}
