'use client';

import { UserXSykDataResponseDto } from '@stryke-xyz/shared-types';
import axios from 'axios';
import { Address } from 'viem';

import { VARROCK_BASE_API_URL } from '@/consts/env';

export interface VestPositionsRequestDto {
  chainId: 8453 | 5000 | 42161 | 81457 | 80084 | 146 | 421614;
}
export interface UserXSykDataRequestDto {
  chainId: 8453 | 5000 | 42161 | 81457 | 80084 | 146 | 421614;
}
export const getUserData = async (
  { chainId }: UserXSykDataRequestDto,
  account: Address,
): Promise<UserXSykDataResponseDto> => {
  const response = await axios
    .get<UserXSykDataResponseDto>(`${VARROCK_BASE_API_URL}/xsyk/vest-positions/${account}?chainId=${chainId}`)
    .then((res) => {
      return (
        res.data ?? {
          positions: [],
          totalSykPending: '0',
          totalXSykAllocated: '0',
        }
      );
    })
    .catch((e) => {
      console.error(e);
      return {
        positions: [],
        totalSykPending: '0',
        totalXSykAllocated: '0',
      };
    });

  return response;
};
