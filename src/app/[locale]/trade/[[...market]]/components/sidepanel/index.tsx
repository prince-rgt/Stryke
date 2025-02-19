import { BUILD_APP_NAMES } from '@/types';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { cn } from '@/utils/styles';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import useStrikesStore from '../../hooks/store/useStrikesStore';

import { BUILD_APP_NAME } from '@/consts/env';
import { ONBOARDING_STEPS_CLASSES } from '../onboarding-flow/consts';

import LpTab from './lp-tab';
import MemeMarketDisclaimer from './meme-market-disclaimer';
import QuickLinks from './quick-links';
import TradeTab from './trade-tab';

enum SidePanelTabs {
  LP = 'Liquidity_Provision',
  Trade = 'TRADE',
}

export const SIDE_PANEL_WIDTH = 340;

const BUILD_APP_SIDEPANEL_BORDER_ACCENT = {
  [BUILD_APP_NAMES.STRYKE]: null,
  [BUILD_APP_NAMES.KODIAK]: null,
  [BUILD_APP_NAMES.BERACHAIN_TESTNET]: null,
  [BUILD_APP_NAMES.PANCAKESWAP]: 'rounded-custom bg-gradient-to-b from-[#54DEE9] to-[#7645D9] p-[1px] h-fit',
};

const Sidepanel = () => {
  const { selectedMarket } = useStrikesStore();
  const { isMemePair } = selectedMarket;
  const searchParams = useSearchParams();
  const defaultTabQuery = searchParams.get('defaultTab');
  const [selectedTab, setSelectedTab] = useState<SidePanelTabs>(SidePanelTabs.Trade);

  useEffect(() => {
    if (defaultTabQuery === SidePanelTabs.LP) {
      setSelectedTab(SidePanelTabs.LP);
    } else {
      setSelectedTab(SidePanelTabs.Trade);
    }
  }, [defaultTabQuery]);

  return (
    <div className={cn('flex max-h-full flex-col space-y-[1px]', BUILD_APP_SIDEPANEL_BORDER_ACCENT[BUILD_APP_NAME])}>
      <div className={cn(ONBOARDING_STEPS_CLASSES['tradingSidepanel'], 'overflow-auto rounded-custom')}>
        <Tabs
          value={selectedTab}
          onValueChange={(v: string) => {
            if (v && v != selectedTab) setSelectedTab(v as SidePanelTabs);
          }}
          style={{ width: SIDE_PANEL_WIDTH }}>
          <TabsList className="w-full">
            <TabsTrigger className="h-full w-1/2" value={SidePanelTabs.Trade}>
              Trade
            </TabsTrigger>
            <TabsTrigger className="h-full w-1/2" value={SidePanelTabs.LP}>
              Liquidity Provision
            </TabsTrigger>
          </TabsList>
          <TabsContent className="flex flex-col mt-[1px] space-y-[1px]" value={SidePanelTabs.Trade}>
            <TradeTab />
          </TabsContent>
          <TabsContent className="flex flex-col space-y-[1px]" value={SidePanelTabs.LP}>
            <LpTab />
          </TabsContent>
        </Tabs>
        {isMemePair && <MemeMarketDisclaimer />}
        <QuickLinks />
      </div>
    </div>
  );
};

export default Sidepanel;
