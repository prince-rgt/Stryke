'use client';

import { UserVotesResponseDto } from '@stryke-xyz/shared-types';
import axios from 'axios';

import { VARROCK_BASE_API_URL } from '@/consts/env';

export const getUserVotes = async (accountId: string, chainId: number): Promise<UserVotesResponseDto> => {
  try {
    const response = await axios.get<UserVotesResponseDto>(
      `${VARROCK_BASE_API_URL}/gauges/user-votes/${accountId}?chainId=${chainId}`,
    );
    return (
      response.data ?? {
        data: {
          user: null,
        },
      }
    );
  } catch (error) {
    console.error('Error fetching user votes:', error);
    return {
      id: '',
      votes: [],
    };
  }
};
