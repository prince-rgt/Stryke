'use client';

import { BUILD_APP_NAMES } from '@/types';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

import { cn } from '@/utils/styles';

import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import Logo from '../../components/logo';
import MarketHeader from './components/market-header';
import OnboardingFlow from './components/onboarding-flow';
import Sidepanel from './components/sidepanel';
import TradingDetails from './components/trading-details';

import { useGlobalUiStore } from '../../hooks/useGlobalUiStore';
import useMarketsData from '../../hooks/useMarketsData';
import useStrikesStore from './hooks/store/useStrikesStore';

import { CHAINS, DEFAULT_CHAIN_ID, SUPPORTED_CHAIN_IDS } from '@/consts/chains';
import { BUILD_APP_NAME } from '@/consts/env';

type Props = {
  params: {
    market: string[] | undefined;
  };
};

const TradingViewChart = dynamic(
  () => import('@/app/[locale]/trade/[[...market]]/components/tradingview-chart').then((module) => module.default),
  {
    ssr: false,
  },
);

const DEFAULT_PAIR_BY_BUILD_APP = {
  [BUILD_APP_NAMES.STRYKE]: 'WETH-USDC',
  [BUILD_APP_NAMES.PANCAKESWAP]: 'WETH-USDC',
  [BUILD_APP_NAMES.KODIAK]: 'WBERA-HONEY',
  [BUILD_APP_NAMES.BERACHAIN_TESTNET]: 'WBERA-HONEY',
};

const DEFAULT_PAIR = DEFAULT_PAIR_BY_BUILD_APP[BUILD_APP_NAME];

const overrideBodyLayout = (chainId: number, pair: string, isChartCollapsed: boolean) => {
  switch (BUILD_APP_NAME) {
    case BUILD_APP_NAMES.PANCAKESWAP:
      return (
        <div className="h-full flex flex-grow flex-col">
          <Collapsible className="data-[state=open]:flex-grow" open={!isChartCollapsed}>
            <CollapsibleContent
              className={
                'flex-grow data-[state=open]:min-h-[300px] data-[state=open]:h-full bg-secondary rounded-t-custom py-5'
              }>
              <TradingViewChart chainId={chainId} ticker={pair.replace('-', '/')} />
            </CollapsibleContent>
          </Collapsible>
          <TradingDetails />
        </div>
      );
    default:
      return (
        <>
          <Collapsible className="data-[state=open]:flex-grow" open={!isChartCollapsed}>
            <CollapsibleContent className="flex-grow data-[state=open]:min-h-[300px] data-[state=open]:h-full">
              <TradingViewChart chainId={chainId} ticker={pair.replace('-', '/')} />
            </CollapsibleContent>
          </Collapsible>
          <TradingDetails />
        </>
      );
  }
};

const Trade = ({ params: { market = [CHAINS[DEFAULT_CHAIN_ID].name, DEFAULT_PAIR] } }: Props) => {
  const { data: marketsData, isLoading } = useMarketsData({ chainIds: [...SUPPORTED_CHAIN_IDS] });

  const { isChartCollapsed } = useStrikesStore();

  const [showOnboarding, setShowOnboarding] = useState(false);

  const { setTriggerTradeOnboardingFlow } = useGlobalUiStore();

  useEffect(() => {
    setTriggerTradeOnboardingFlow(() => setShowOnboarding(true));
  }, [setTriggerTradeOnboardingFlow]);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasCompletedOnboarding', 'true');
  };

  if (isLoading || !marketsData) {
    return (
      <div className="w-full h-full flex justify-center items-center z-50">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse">
            <Logo width={180} height={180} className="blur-0 animate-blur" />
          </div>
          <Logo width={180} height={180} />
        </div>
      </div>
    );
  }
  const network = market[0];
  const pair = market[1];

  const selectedPair =
    marketsData.find(({ pairLabel, chainName }) => {
      return pair == pairLabel && chainName == network;
    }) || marketsData[0];

  return (
    <div className="flex flex-grow overflow-hidden space-x-xs mx-xs mt-xs">
      <div className="flex flex-grow flex-col space-y-xs">
        <MarketHeader selectedMarket={selectedPair} />
        {overrideBodyLayout(selectedPair?.chainId ?? DEFAULT_CHAIN_ID, pair.replace('-', '/'), isChartCollapsed)}
      </div>
      <Sidepanel />
      {showOnboarding && <OnboardingFlow onClose={handleOnboardingClose} />}
    </div>
  );
};

export default Trade;
