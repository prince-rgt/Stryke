import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getPriceCandles } from '@/utils/actions/varrock/price';
import { cn } from '@/utils/styles';

import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';

import { usePricesStore } from '@/app/[locale]/hooks/usePricesStore';

const TOKENS = [
  {
    chainId: 42161,
    ticker: 'WSYK/USDC', // Dummy Details
    label: 'SYK',
  },
  {
    chainId: 42161,
    ticker: 'WETH/USDC',
    label: 'ETH',
  },
  {
    chainId: 42161,
    ticker: 'WBTC/USDC',
    label: 'BTC',
  },
];

const Prices = () => {
  const { setPrices } = usePricesStore();
  const { data: priceData } = useQuery({
    queryKey: ['price'],
    queryFn: async () => {
      const priceDataPromises = TOKENS.map(async ({ chainId, ticker, label }, index) => {
        const { open, close } = (await getPriceCandles(chainId, ticker))?.[0];
        return {
          markPrice: close.toFixed(2),
          label,
          delta: (((close - open) * 100) / open).toFixed(2),
          markPriceRaw: close,
        };
      });

      return Promise.all(priceDataPromises);
    },
    refetchInterval: 5000,
  });

  useEffect(() => {
    const pricesMap = new Map();
    priceData?.forEach(({ label, markPriceRaw }) => {
      pricesMap.set(label, markPriceRaw);
    });
    setPrices(pricesMap);
  }, [priceData, setPrices]);

  return (
    <div className="flex space-x-md">
      {priceData ? (
        priceData.map(({ markPrice, label, delta }) => {
          return (
            <Typography key={label} className="flex" variant={'extra-small-regular'}>
              {label}
              <span className="ml-1.5 text-muted-foreground">${markPrice}</span>
              <span className={cn('ml-1.5 text-success', { 'text-destructive': Number(delta) < 0 })}>
                {Number(delta) > 0 && '+'}
                {delta}%
              </span>
            </Typography>
          );
        })
      ) : (
        <>
          {TOKENS.map(({ label }) => (
            <Typography as="div" key={label} className="flex" variant={'extra-small-regular'}>
              {label}
              <Skeleton key={label} className="ml-1.5 flex h-full w-[86px] rounded-sm" />
            </Typography>
          ))}
        </>
      )}
    </div>
  );
};

export default Prices;
