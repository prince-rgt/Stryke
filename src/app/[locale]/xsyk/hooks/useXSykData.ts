import { SupportedChainIdType } from '@/types';
import { VestPosition } from '@/types/varrock';

import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { useAccount, useReadContracts, useWriteContract } from 'wagmi';

import { getUserData } from '@/utils/actions/varrock/xsyk';
import { getSykConfig } from '@/app/[locale]/xsyk/utils';

import xStrykeTokenAbi from '@/abi/xStrykeTokenAbi';

import { DEFAULT_CHAIN_ID } from '@/consts/chains';
import { SUPPORTED_XSYK_CHAINS } from '../consts';

import { SupportedXsykChain, UserVestDataReturnType, VestEntry } from '../types';

const useXSykData = () => {
  const { chainId: chain = DEFAULT_CHAIN_ID, address: user = '0x' } = useAccount();

  const { xsyk } = getSykConfig(
    chain && chain in SUPPORTED_XSYK_CHAINS ? (chain as SupportedXsykChain) : (42161 as SupportedXsykChain),
  );

  const {
    data = [] as VestPosition[],
    refetch,
    ...rest
  } = useQuery({
    queryKey: [chain, user],
    queryFn: async () =>
      await getUserData({ chainId: chain as SupportedChainIdType }, user).then((res) => res.positions),
    staleTime: Infinity,
  });

  const [txLoading, setTxLoading] = useState<{ id: bigint; loading: boolean }>({ id: BigInt(0), loading: false });

  const { writeContractAsync } = useWriteContract();

  const redeem = useCallback(
    async (vestIndex: bigint) => {
      setTxLoading({ id: vestIndex, loading: true });
      await writeContractAsync({
        abi: xStrykeTokenAbi,
        address: xsyk.address,
        functionName: 'redeem',
        args: [vestIndex],
      })
        .then(() => setTxLoading({ id: vestIndex, loading: false }))
        .catch(() =>
          setTxLoading({
            id: vestIndex,
            loading: false,
          }),
        );
    },
    [writeContractAsync, xsyk.address],
  );

  const vestPositions: VestEntry[] = useMemo(() => {
    if (data.length === 0) return [];

    const _data = data.map(({ duration, xSykAmount, sykAmount, vestIndex, blockTimestamp }) => {
      return {
        xSykAmount,
        sykAmount,
        blockTimestamp,
        duration,
        vestIndex,
        button: {
          label: txLoading.loading && txLoading.id === BigInt(vestIndex) ? 'Claiming...' : 'Claim',
          action: async () =>
            await redeem(BigInt(vestIndex)).then(() => {
              refetch();
            }),
          disabled: txLoading.loading || blockTimestamp + duration > BigInt(Math.ceil(new Date().getTime() / 1000)),
        },
      };
    });

    return _data;
  }, [data, redeem, txLoading, refetch]);

  const { data: userVestData = [] } = useReadContracts({
    contracts: vestPositions.map((d) => ({
      abi: xStrykeTokenAbi,
      address: xsyk.address,
      functionName: 'vests',
      args: [BigInt(d.vestIndex)],
    })),
  });

  const activePositions = useMemo(
    () => vestPositions.filter((_, index) => (userVestData as UserVestDataReturnType)[index]?.result?.[4] === 1), // 1 => VestStatus.ACTIVE
    [userVestData, vestPositions],
  );

  return {
    activePositions,
    redeeming: txLoading,
    vestedPositionsCount: activePositions.length,
    refetch,
    ...rest,
  };
};

export default useXSykData;
