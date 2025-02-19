'use client';

import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { getTotalVolumeForChain } from '@/utils/actions/varrock/chain-stats';

import NumberDisplay from '@/components/ui/number-display';
import Panel from '@/app/[locale]/leaderboard/components/header/panel';
import Title from '@/app/[locale]/leaderboard/components/header/title';

import usePnlData from '@/app/[locale]/leaderboard/hooks/usePnlData';

import { CHAINS, DEFAULT_CHAIN_ID } from '@/consts/chains';
import { TimeFrame } from '../../consts';

const SUPPORTED_CHAINS = [42161];

const Header = () => {
  const { chainId = DEFAULT_CHAIN_ID } = useAccount();

  const {
    data: totalVolume = 0,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['total-volume', chainId],
    queryFn: async () => await getTotalVolumeForChain(chainId),
    staleTime: 30_000,
    refetchInterval: 30_000,
  });

  // Total users in the last 6 months
  const { isLoadingAny, totalUsers } = usePnlData({
    period: TimeFrame.SixMonths,
    chainId,
  });

  return (
    <div className="flex flex-col p-lg gap-y-md">
      <Title />
      <div className="flex w-full divide-x divide-background border border-background">
        <Panel
          label={`Total Trading Volume ${SUPPORTED_CHAINS.includes(Number(chainId)) ? `(${CHAINS[chainId].name})` : ''}`}
          data={isLoading && !isError ? 'Loading...' : <NumberDisplay value={totalVolume} format="usd" precision={3} />}
        />
        <Panel label="Total Users (6M)" data={isLoadingAny ? 'Loading...' : totalUsers} />
      </div>
    </div>
  );
};

export default Header;
