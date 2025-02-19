'use client';

import { UserXSykDataRequestDto, UserXSykDataResponseDto, VestPositionsRequestDto } from '@stryke-xyz/shared-types';
import axios from 'axios';
import { Address } from 'viem';

import { VARROCK_BASE_API_URL } from '@/consts/env';

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
