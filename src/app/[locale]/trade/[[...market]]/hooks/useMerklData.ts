import { TokenData } from '@/types';

import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { Address, checksumAddress, Hex, zeroAddress } from 'viem';
import { useWriteContract } from 'wagmi';

import merklDistributorAbi from '@/abi/merklDistributorAbi';

import { SUPPORTED_CHAIN_IDS } from '@/consts/chains';
import { TOKEN_LIST_BY_CHAIN_ID } from '@/consts/token-list';

type Props = {
  user: Address | undefined;
  chainId: number;
  pool: Address | undefined;
};

type IncentiveData = {
  accumulated: string;
  decimals: string;
  reasons: {
    [key: string]: {
      accumulated: string;
      unclaimed: string;
    };
  };
  symbol: string;
  unclaimed: string;
  proof: Hex[];
};

type ApiResult = {
  [token: Address]: IncentiveData;
};

const INCENTIVES: TokenData[] | undefined = TOKEN_LIST_BY_CHAIN_ID[SUPPORTED_CHAIN_IDS[0]]?.filter((t) =>
  [
    // '0x912ce59144191c1204e64559fe8253a0e49e6548', // ARB
    '0x50e04e222fc1be96e94e86acf1136cb0e97e1d40', // xSYK
    '0xacc51ffdef63fb0c014c882267c3a17261a5ed50', // SYK
  ].includes(t.address.toLowerCase()),
);

/**
 * @note Not pool specific. Rewards displayed are aggregated across all merkl pools earning ARB & SYK
 */
const useMerklData = (props: Props) => {
  const { user = zeroAddress, chainId = 42161 /* pool = zeroAddress */ } = props;

  const { data, refetch, isLoading } = useQuery<ApiResult, Error>({
    queryKey: ['user-merkl-rewards'],
    queryFn: () =>
      fetch(`https://api.merkl.xyz/v3/userRewards?user=${user}&chainId=${chainId}&proof=true`)
        .then((res) => res.json())
        .catch((e) => console.error(e)),
    staleTime: 3200,
  });

  const rewards: (Omit<IncentiveData, 'reasons'> & { address: Address })[] = useMemo(() => {
    if (!data || !INCENTIVES) return [];
    const _rewards: (IncentiveData & { address: Address })[] = [];
    INCENTIVES.forEach((i) => {
      if (Object.keys(data).includes(i.address)) {
        _rewards.push({ ...data[i.address], address: i.address });
      }
    });
    return _rewards.map(({ unclaimed, symbol, proof, decimals, address, accumulated }) => ({
      accumulated,
      unclaimed,
      symbol,
      proof,
      decimals,
      address,
    }));
  }, [data]);

  const { writeContractAsync: claim, isPending: claiming, isSuccess: claimed } = useWriteContract();

  return {
    data,
    rewards,
    claim: useCallback(
      async () =>
        user != zeroAddress
          ? await claim({
              abi: merklDistributorAbi,
              address: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae', // Merkl Distributor Address
              functionName: 'claim',
              args: [
                [...rewards.map(() => user)], // user address array's length must be the same as the reward tokens to claim
                [...rewards.map((token) => checksumAddress(token.address))], // address of each reward token
                [...rewards.map((token) => BigInt(token.accumulated))], // transactionData object for each reward token
                [...rewards.map((token) => token.proof)], // merkle proof for each reward token to claim
              ],
            })
          : console.error('User address is invalid ', user),
      [claim, rewards, user],
    ),
    claiming,
    claimable: rewards.map((r) => BigInt(r.unclaimed) > 0n).length != 0 && user != zeroAddress,
    claimed,
    refetch,
    isLoading,
    claimableTokensData: rewards,
  };
};

export default useMerklData;
