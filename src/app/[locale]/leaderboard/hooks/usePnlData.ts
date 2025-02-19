import { UserPnlResponseDto } from '@/app/[locale]/leaderboard/types';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getPnlDeltaBounded } from '@/utils/actions/varrock/leaderboard';

import { TimeFrame } from '../consts';

type Props = {
  period: TimeFrame;
  chainId: number;
};

const usePnlData = ({ period, chainId }: Props) => {
  const { data = [], isLoading: isLoading } = useQuery({
    queryKey: ['pnl-delta-bounded-all', chainId, period],
    queryFn: async () =>
      await getPnlDeltaBounded({
        period,
        chainId: chainId,
        user: undefined,
      }),
    staleTime: 600_000, // 10 minutes
  });

  const pnlDeltas: (UserPnlResponseDto & { rank: number })[] = useMemo(() => {
    if (!data) return [] as (UserPnlResponseDto & { rank: number })[];
    return data
      .sort((a, b) => Number(b.pnl) - Number(a.pnl))
      .filter((a) => a.lastTradeTimestamp !== a.firstTradeTimestamp)
      .map((data, index) => ({ ...data, rank: index + 1 }))
      .slice(0, 30); // display the top 30 users
  }, [data]);

  return { pnlDeltas, isLoadingAny: isLoading, totalUsers: data?.length ?? 0 };
};

export default usePnlData;
