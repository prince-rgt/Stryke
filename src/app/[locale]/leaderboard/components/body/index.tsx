'use client';

import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { arbitrum } from 'viem/chains';

import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Typography } from '@/components/ui/typography';
import TradingLeaderboard from '@/app/[locale]/leaderboard/components/body/tables/trading-leaderboard';
import Timeframes from '@/app/[locale]/leaderboard/components/body/timeframes';

import usePnlData from '@/app/[locale]/leaderboard/hooks/usePnlData';
import { useTimeframeStore } from '@/app/[locale]/leaderboard/hooks/useTimeframeStore';

let today = new Date();
// cache useQuery call for 1 hour
today.setHours(today.getHours(), 0, 0, 0);

const Body = () => {
  const timeframe = useTimeframeStore((state) => state.timeframe);

  const [input, setInput] = useState<string>('');

  const { pnlDeltas, isLoadingAny } = usePnlData({
    period: timeframe,
    chainId: arbitrum.id,
  });

  return (
    <div className="flex-grow overflow-hidden m-lg border border-background">
      <Tabs className="flex flex-col h-full w-full space-y-[1px]" defaultValue="trading">
        <TabsList className="flex-shrink-0 h-8 w-fit border-r border-background">
          <TabsTrigger className="h-full" value="trading">
            <Typography variant="small-medium">Trading</Typography>
          </TabsTrigger>
          {/* <TabsTrigger className="h-full hover:cursor-not-allowed" value="referrals" disabled>
              <Typography variant="small-medium">Referrals</Typography>
            </TabsTrigger> */}
        </TabsList>
        <TabsContent className="flex-grow flex flex-col overflow-hidden" value="trading">
          <div className="flex gap-x-md p-md bg-secondary">
            <div className="flex bg-muted w-fit items-center justify-center px-sm">
              <MagnifyingGlassIcon width={24} height={24} className="text-muted-foreground" />
              <Input
                variant="default"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                disabled={isLoadingAny}
                type="search"
                className="border-none disabled:bg-muted"
                placeholder="Search by wallet address"
              />
            </div>
            <Timeframes isLoading={isLoadingAny} />
          </div>
          <TradingLeaderboard pnlDeltas={pnlDeltas} isLoading={isLoadingAny} filterString={input} />
        </TabsContent>
        {/* <TabsContent className="h-full" value="referrals">
            2
          </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default Body;
