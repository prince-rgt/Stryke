'use client';

import { Deposit, Purchase } from '@/types/varrock';

import axios from 'axios';

import { VARROCK_BASE_API_URL } from '@/consts/env';

export interface PurchasePositionsRequestDto {
  chainId: 8453 | 5000 | 42161 | 81457 | 80084 | 146 | 421614;
  optionMarket: `0x${string}`;
  user: `0x${string}`;
  first: number;
  skip?: number;
}
export async function getBuyPositions(queryOptions: PurchasePositionsRequestDto): Promise<Purchase[]> {
  const { user, optionMarket, chainId, first, skip } = queryOptions;
  return axios
    .get<Purchase[]>(`${VARROCK_BASE_API_URL}/clamm/purchase/positions`, {
      params: {
        chainId,
        optionMarket,
        user,
        first,
        skip,
      },
    })
    .then(({ data }) => {
      return data;
    })
    .catch((err) => {
      if (!err || !err.response || !err.response.data || !err.response.data.message) {
        console.error(err);
        return [];
      }
      return [];
    });
}

// getLPPositions
export async function getDeposits(
  chainId: number,
  user: string,
  pool: string,
  first: number,
  skip: number,
): Promise<Deposit[]> {
  return axios
    .get<Deposit[]>(`${VARROCK_BASE_API_URL}/clamm/deposit/positions`, {
      params: {
        chainId,
        user,
        pool,
        first,
        skip,
      },
    })
    .then(({ data }) => {
      return data;
    })
    .catch((err) => {
      if (!err || !err.response || !err.response.data || !err.response.data.message) {
        console.error(err);
        return [];
      }
      return [];
    });
}
