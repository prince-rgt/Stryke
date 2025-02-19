import { DoubleArrowDownIcon, DoubleArrowUpIcon, MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { cn } from '@/utils/styles';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Typography } from '@/components/ui/typography';

import useStrikesStore, { TradingDetailTabs } from '../../hooks/store/useStrikesStore';
import useLocalStorage from '@/app/[locale]/hooks/useLocalStorage';

import { ONBOARDING_STEPS_CLASSES } from '../onboarding-flow/consts';

import BuyPositions from './buy-positions';
import LPPositions from './lp-positions';
import OptionsChain from './options-chain';
import TradeHistory from './trade-history';

const SHORTCUT_BADGE_CLASSNAME =
  'ml-2 px-1.5 py-0.5 text-foreground/60 bg-subtle/40 group-data-[state=active]:bg-selected text-xs font-medium rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-100 group-data-[state=active]:text-foreground/75';
const TABS_TRIGGER_CLASSNAME = 'group h-full flex space-x-md items-center';

const TradingDetails = () => {
  const { setActiveTradingDetailTab, activeTradingDetailTab, isChartCollapsed, setChartCollapsed } = useStrikesStore();

  const [isDetailsCollapsed, setDetailsCollapsed] = useLocalStorage('trading-details-collapsed', false);

  const toggleTable = () => {
    setDetailsCollapsed(!isDetailsCollapsed);
    if (isChartCollapsed) {
      setChartCollapsed(false);
    }
  };

  const toggleChart = () => {
    setChartCollapsed(!isChartCollapsed);
    if (isDetailsCollapsed) {
      setDetailsCollapsed(false);
    }
  };

  useHotkeys('c', () => setActiveTradingDetailTab(TradingDetailTabs.OptionsChain), { enableOnFormTags: false });
  useHotkeys('b', () => setActiveTradingDetailTab(TradingDetailTabs.BuyPositions), { enableOnFormTags: false });
  useHotkeys('l', () => setActiveTradingDetailTab(TradingDetailTabs.LPPositions), { enableOnFormTags: false });
  useHotkeys('h', () => setActiveTradingDetailTab(TradingDetailTabs.TradeHistory), { enableOnFormTags: false });

  return (
    <Collapsible
      className="max-h-full data-[state=open]:h-full data-[state=open]:flex-grow"
      open={!isDetailsCollapsed}
      onOpenChange={toggleTable}>
      <Tabs
        className="h-full max-h-full"
        value={activeTradingDetailTab}
        onValueChange={(v) => setActiveTradingDetailTab(v as TradingDetailTabs)}>
        <div
          className={cn(
            ONBOARDING_STEPS_CLASSES['navigationPanel'],
            'navigation-panel flex justify-between bg-active',
          )}>
          <TabsList className="h-8 bg-background">
            <TabsTrigger className={TABS_TRIGGER_CLASSNAME} value={TradingDetailTabs.OptionsChain}>
              <Typography variant={'small-medium'}> Options Chain </Typography>
              <Badge className={SHORTCUT_BADGE_CLASSNAME} bgColor="grey">
                C
              </Badge>
            </TabsTrigger>
            <TabsTrigger className={TABS_TRIGGER_CLASSNAME} value={TradingDetailTabs.BuyPositions}>
              <Typography variant={'small-medium'}>Buy Positions</Typography>
              <Badge className={SHORTCUT_BADGE_CLASSNAME} bgColor="grey">
                B
              </Badge>
            </TabsTrigger>
            <TabsTrigger className={TABS_TRIGGER_CLASSNAME} value={TradingDetailTabs.LPPositions}>
              <Typography variant={'small-medium'}>LP Positions</Typography>
              <Badge className={SHORTCUT_BADGE_CLASSNAME} bgColor="grey">
                L
              </Badge>
            </TabsTrigger>
            <TabsTrigger className={TABS_TRIGGER_CLASSNAME} value={TradingDetailTabs.TradeHistory}>
              <Typography variant={'small-medium'}>Trade History</Typography>
              <Badge className={SHORTCUT_BADGE_CLASSNAME} bgColor="grey">
                H
              </Badge>
            </TabsTrigger>
          </TabsList>
          <div>
            <CollapsibleTrigger>
              <Button variant={'ghost'}>
                {isDetailsCollapsed ? <PlusIcon className="h-4 w-4" /> : <MinusIcon className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <Button variant={'ghost'} onClick={toggleChart}>
              {isChartCollapsed ? (
                <DoubleArrowDownIcon className="h-4 w-4" />
              ) : (
                <DoubleArrowUpIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <CollapsibleContent className="h-full flex-grow">
          <div className="h-full flex-grow">
            <TabsContent className="h-full" value={TradingDetailTabs.OptionsChain}>
              <OptionsChain />
            </TabsContent>
            <TabsContent value={TradingDetailTabs.BuyPositions}>
              <BuyPositions />
            </TabsContent>
            <TabsContent value={TradingDetailTabs.LPPositions}>
              <LPPositions />
            </TabsContent>
            <TabsContent value={TradingDetailTabs.TradeHistory}>
              <TradeHistory />
            </TabsContent>
          </div>
        </CollapsibleContent>
      </Tabs>
    </Collapsible>
  );
};

export default TradingDetails;
