import { MarketData } from '@/types';
import { Strikes } from '@/types/varrock';

import { ChevronDownIcon, MagnifyingGlassIcon, OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { CommandIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useToggle } from 'react-use';
import { arbitrum } from 'viem/chains';

import { getMarkPrice } from '@/utils/actions/varrock/price';
import getStrikesChain from '@/utils/actions/varrock/strikes';
import { cn } from '@/utils/styles';
import { aggregateDataAndSetStrikes } from './utils';

import { Link, useRouter } from '@/navigation';

import { Badge, badgeVariants } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import NumberDisplay from '@/components/ui/number-display';
import { Typography } from '@/components/ui/typography';
import { MarketTable } from '@/app/[locale]/components/markets-table';
import TokenPair from '@/app/[locale]/components/token-pair';

import useStrikesStore from '../../hooks/store/useStrikesStore';

import { ONBOARDING_STEPS_CLASSES } from '../onboarding-flow/consts';

const MarketHeader = ({ selectedMarket }: { selectedMarket: MarketData }) => {
  const {
    pair,
    address,
    chainId,
    pairLabel,
    openInterest,
    liquidity,
    volume24h,
    chainName,
    circulatingSupply,
    isMemePair,
  } = selectedMarket;
  const [isOpen, toggle] = useToggle(false);
  const [filterString, setFilterString] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [rowCount, setRowCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const {
    setStrikes,
    setMarkPrice,
    setMarkPriceUsd,
    markPriceUsd,
    setSelectedMarket,
    markPrice,
    setRefetchStrikesData,
    setTick,
    quoteAssetPriceUsd,
    setQuoteAssetPriceUsd,
    setIsStrikesChainLoading,
    setDisplayStrikesAsMarketCap,
  } = useStrikesStore();

  useEffect(() => {
    setSelectedMarket(selectedMarket);
  }, [selectedMarket, setSelectedMarket]);

  const {
    data = [],
    refetch: refetchStrikes,
    isLoading: isStrikesChainLoading,
  } = useQuery<Strikes | undefined>({
    queryKey: ['strikes', address, chainId, pairLabel],
    queryFn: async () =>
      await getStrikesChain({
        chainId,
        optionMarket: address,
        callsReach: 800,
        putsReach: 800,
      }).catch(() => []),
    staleTime: 1000,
    refetchInterval: 4000,
  });

  useEffect(() => {
    setIsStrikesChainLoading(isStrikesChainLoading);
  }, [isStrikesChainLoading, setIsStrikesChainLoading]);

  const { data: priceData } = useQuery({
    queryKey: ['price', pairLabel, chainId],
    queryFn: async () => {
      return await getMarkPrice(chainId, pairLabel.replace('-', '/'));
    },
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (data.length) {
      const display = aggregateDataAndSetStrikes(
        data,
        markPrice,
        markPriceUsd,
        pair,
        circulatingSupply,
        quoteAssetPriceUsd,
        isMemePair,
        chainId,
        selectedMarket.primePool,
      );
      setStrikes(display);
    }
  }, [
    chainId,
    circulatingSupply,
    data,
    isMemePair,
    markPrice,
    markPriceUsd,
    pair,
    quoteAssetPriceUsd,
    setStrikes,
    selectedMarket,
  ]);

  useEffect(() => {
    setRefetchStrikesData(refetchStrikes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isMemePair) {
      setDisplayStrikesAsMarketCap(true);
    } else {
      setDisplayStrikesAsMarketCap(false);
    }
  }, [isMemePair, setDisplayStrikesAsMarketCap]);

  useEffect(() => {
    if (priceData) {
      setMarkPrice(priceData.markPrice);
      setTick(priceData.tick);
      setMarkPriceUsd(priceData.markPriceUsd);
      setQuoteAssetPriceUsd(priceData.quoteAssetPriceUsd);
    }
  }, [priceData, setMarkPrice, setMarkPriceUsd, setQuoteAssetPriceUsd, setTick]);

  const isMac = navigator.userAgent.indexOf('Mac') !== -1;

  useHotkeys(
    isMac ? 'meta + k' : 'ctrl + k',
    () => {
      toggle();
      setTimeout(() => inputRef.current?.focus(), 0);
    },
    { preventDefault: true },
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % rowCount);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + rowCount) % rowCount);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          const selectedMarket = document.querySelector(`[data-row-index="${selectedIndex}"]`);
          if (selectedMarket) {
            const chainName = selectedMarket.getAttribute('data-chain-name');
            const pairLabel = selectedMarket.getAttribute('data-pair-label');
            if (chainName && pairLabel) {
              router.push(`/trade/${chainName}/${pairLabel}`);
              toggle();
            }
          }
        }
        break;
    }
  };

  useEffect(() => {
    setSelectedIndex(rowCount ? 0 : -1);
  }, [filterString, rowCount]);

  return (
    <div className="flex flex-col w-full justify-start bg-primary rounded-custom">
      <div className="flex items-center space-x-sm">
        <Dialog open={isOpen} onOpenChange={toggle}>
          <DialogTrigger asChild>
            <div
              className={cn(
                ONBOARDING_STEPS_CLASSES['tradingPair'],
                'flex w-[245px] cursor-pointer items-center justify-between bg-secondary px-md py-[7.7px] hover:opacity-80 rounded-l-custom',
              )}
              role="button">
              <TokenPair pair={pair} typographyVariant={'p-medium'} />
              <div className="flex space-x-md items-center">
                <Badge bgColor="grey">{isMac ? <CommandIcon className="mr-0.5 h-3 w-3" /> : 'Ctrl '}k</Badge>
                <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </DialogTrigger>
          <DialogContent displayCloseButton={false} className="flex max-w-[808px] flex-col p-0">
            <div className="flex w-full items-center justify-between p-md">
              <div className="flex flex-grow items-center">
                <MagnifyingGlassIcon className="h-4 w-4" />
                <Input
                  placeholder="Search"
                  className="w-full"
                  variant={'ghost'}
                  value={filterString}
                  onChange={(e) => setFilterString(e.target.value)}
                  onKeyDown={handleKeyDown}
                  ref={inputRef}
                />
              </div>
              <Button variant={'secondary'} size={'sm'} onClick={(e) => setFilterString('')}>
                <Typography variant={'small-medium'}>Clear</Typography>
              </Button>
            </div>
            <MarketTable
              filterString={filterString}
              columnsToRender={['pair', 'chainName', 'liquidity', 'openInterest', 'totalEarnings']}
              classNames={{ tableBody: 'bg-primary' }}
              keyboardNavigation={{
                selectedIndex,
                onRowCountChange: setRowCount,
              }}
            />
          </DialogContent>
        </Dialog>
        <div className="flex flex-col items-center px-md">
          <Typography className="capitalize" variant={'p-bold'}>
            {chainName}
          </Typography>
          <Typography variant={'caption-bold'} className="uppercase text-muted-foreground">
            Network
          </Typography>
        </div>
        <div className="flex flex-col items-center px-md">
          <Typography variant={'p-bold'}>
            {isMemePair ? (
              <NumberDisplay showDecimalZerosSubscript precision={6} format="usd" value={markPriceUsd} />
            ) : (
              <NumberDisplay format="usd" value={markPriceUsd} precision={3} />
            )}
          </Typography>
          <Typography variant={'caption-bold'} className="uppercase text-muted-foreground">
            Mark Price
          </Typography>
        </div>

        <div className="flex flex-col items-center px-md">
          <Typography variant={'p-bold'}>
            <NumberDisplay format="usd" value={liquidity.totalLiquidity} />
          </Typography>
          <Typography variant={'caption-bold'} className="uppercase text-muted-foreground">
            Total Liquidity
          </Typography>
        </div>
        <div className="flex flex-col items-center px-md">
          <Typography variant={'p-bold'}>
            {isMemePair ? (
              <>
                <NumberDisplay format="tokenAmount" value={openInterest / markPriceUsd} /> {pair?.[0].symbol}
              </>
            ) : (
              <NumberDisplay format="usd" value={openInterest} />
            )}
          </Typography>
          <Typography variant={'caption-bold'} className="uppercase text-muted-foreground">
            Open Interest
          </Typography>
        </div>
        <div className="flex flex-col items-center px-md">
          <Typography variant={'p-bold'}>
            {isMemePair ? (
              <>
                <NumberDisplay format="tokenAmount" value={volume24h / markPriceUsd} /> {pair?.[0].symbol}
              </>
            ) : (
              <NumberDisplay format="usd" value={volume24h} />
            )}
          </Typography>
          <Typography variant={'caption-bold'} className="uppercase text-muted-foreground">
            24H Volume
          </Typography>
        </div>
      </div>
      {/* {chainId === arbitrum.id && (
        <div className="my-auto mr-2 w-full">
          <Link
            target="_blank"
            href={'https://x.com/stryke_xyz/status/1876896264865882147'}
            className={cn(badgeVariants({ bgColor: 'red' }), 'w-full flex justify-between text-md')}>
            {'Trading paused on this market, will resume shortly. Check our twitter/discord for more information.'}
            <OpenInNewWindowIcon className="ml-md h-6 w-6" />
          </Link>
        </div>
      )} */}
    </div>
  );
};

export default MarketHeader;
