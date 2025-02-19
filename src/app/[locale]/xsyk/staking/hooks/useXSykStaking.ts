import { TokenData } from '@/types';

import { SupportedXsykChain } from '@/app/[locale]/xsyk/types';
import { useMemo } from 'react';
import { encodeAbiParameters, formatUnits, keccak256, zeroAddress } from 'viem';
import { useAccount, useReadContract, useReadContracts } from 'wagmi';

import { getSykConfig } from '@/app/[locale]/xsyk/utils';

import xSykStakingAbi from '@/abi/xStrykeStakingAbi';

import { DEFAULT_CHAIN_ID } from '@/consts/chains';
import { SUPPORTED_XSYK_CHAINS } from '../../consts';

const useXSykStaking = () => {
  const { address: user = zeroAddress, chainId = DEFAULT_CHAIN_ID } = useAccount();

  const { syk, xsyk, xsykStaking } = getSykConfig(
    chainId in SUPPORTED_XSYK_CHAINS ? (chainId as SupportedXsykChain) : (42161 as SupportedXsykChain),
  );

  const { data: stakedBalance = 0n, refetch: refetchStakedBalance } = useReadContract({
    abi: xSykStakingAbi,
    address: xsykStaking,
    functionName: 'balanceOf',
    args: [
      keccak256(
        encodeAbiParameters(
          [
            { name: 'chainId', type: 'uint256' },
            { name: 'account', type: 'address' },
          ],
          [BigInt(chainId), user],
        ),
      ),
    ],
  });
  const { data: totalSupply = 0n, refetch: refetchTotalStaked } = useReadContract({
    abi: xSykStakingAbi,
    address: xsykStaking,
    functionName: 'totalSupply',
  });
  const {
    data = [],
    isLoading,
    refetch: refetchRewardData,
  } = useReadContracts({
    contracts: [
      {
        abi: xSykStakingAbi,
        address: xsykStaking,
        functionName: 'xSykRewardPercentage',
      },
      {
        abi: xSykStakingAbi,
        address: xsykStaking,
        functionName: 'rewardRate',
      },
      {
        abi: xSykStakingAbi,
        address: xsykStaking,
        functionName: 'earned',
        args: [
          keccak256(
            encodeAbiParameters(
              [
                { name: 'chainId', type: 'uint256' },
                { name: '_account', type: 'address' },
              ],
              [BigInt(chainId), user],
            ),
          ),
        ],
      },
    ],
  });

  const xSykRewardPercentage = useMemo(() => {
    if (!data[0] || !data[0].result) return 0n;
    return data[0].result;
  }, [data]);

  const earnedAmounts: (TokenData & { amount: bigint })[] = useMemo(() => {
    if (!data[2] || !data[2].result)
      return [
        { ...xsyk, amount: 0n },
        { ...syk, amount: 0n },
      ];
    else if (xSykRewardPercentage === 0n)
      return [
        { ...syk, amount: data[2].result },
        { ...xsyk, amount: 0n },
      ];

    return [
      { ...syk, amount: (data[2].result * (100n - xSykRewardPercentage)) / 100n },
      { ...xsyk, amount: (data[2].result * xSykRewardPercentage) / 100n },
    ];
  }, [data, syk, xSykRewardPercentage, xsyk]);

  const apr = useMemo(() => {
    if (!data[1] || !data[1].result || totalSupply == 0n) return 0;
    const rewardRate = data[1].result;

    // 31556926 is the number of seconds in a year
    return (
      ((Number(formatUnits(rewardRate, syk.decimals)) * 31556926) / Number(formatUnits(totalSupply, xsyk.decimals))) *
      100
    );
  }, [data, syk.decimals, totalSupply, xsyk.decimals]);

  const userShare = useMemo(() => {
    if (totalSupply === 0n) return 0;
    return (Number(formatUnits(stakedBalance, xsyk.decimals)) / Number(formatUnits(totalSupply, xsyk.decimals))) * 100;
  }, [stakedBalance, totalSupply, xsyk.decimals]);

  return {
    xSykRewardPercentage,
    earnedAmounts,
    totalSupply,
    stakedBalance,
    apr,
    refetchStakedBalance,
    refetchTotalStaked,
    refetchRewardData,
    userShare,
    isRewardDataLoading: isLoading,
  };
};

export default useXSykStaking;
