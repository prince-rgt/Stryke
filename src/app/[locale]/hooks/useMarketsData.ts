import { BUILD_APP_NAMES, MarketData, SupportedChainIdType, TokenData } from '@/types';
import { OptionMarket } from '@/types/varrock';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Address, getAddress } from 'viem';

import { getTokenData } from '@/utils/tokens';

import { CHAINS, DEFAULT_CHAIN_ID } from '@/consts/chains';
import { BUILD_APP_NAME, VARROCK_BASE_API_URL } from '@/consts/env';

import { usePricesStore } from './usePricesStore';

const MEME_PAIRS = ['BOOP-WETH', 'DEGEN-WETH', 'BRETT-WETH'];

const PAIR_TO_CIRCULATING_SUPPLY: { [key: string]: number } = {
  'BOOP-WETH': 99.59 * 1e9,
  'DEGEN-WETH': 12.48 * 1e9,
  'BRETT-WETH': 9.91 * 1e9,
};

const isPCS = BUILD_APP_NAME === BUILD_APP_NAMES.PANCAKESWAP;

function getMarketData(
  optionMarkets: OptionMarket[],
  prices: {
    ethPrice: number;
  },
): MarketData[] {
  let _optionMarkets = isPCS
    ? optionMarkets.filter((market) => market.pools.some((pool: { name: string }) => pool.name === 'pancakeswap'))
    : optionMarkets;
  return _optionMarkets
    .filter(({ deprecated }) => !deprecated)
    .map(
      ({
        callToken,
        putToken,
        deprecated,
        address,
        availableLiquidity: _availableLiquidity,
        chainId,
        openInterest,
        premiums24h,
        totalLiquidity: _totalLiquidity,
        volume24h,
        optionsPricing,
        primePool,
        tickSpacing,
        isLimitOrdersEnabled,
      }: OptionMarket) => {
        const callTokenData = getTokenData({
          address: callToken.address as Address,
          chainId: chainId as SupportedChainIdType,
        });
        const putTokenData = getTokenData({
          address: putToken.address as Address,
          chainId: chainId as SupportedChainIdType,
        });

        const pairLabel = [callTokenData, putTokenData].map(({ symbol }) => symbol).join('-');
        const isMemePair = MEME_PAIRS.includes(pairLabel);

        const circulatingSupply = PAIR_TO_CIRCULATING_SUPPLY[pairLabel] ?? Infinity;
        // TODO: will move to backend
        const ethPrice = prices.ethPrice;
        const isPutTokenWeth = putTokenData.symbol === 'WETH';

        const availableLiquidity = isPutTokenWeth ? _availableLiquidity * ethPrice : _availableLiquidity;
        const totalLiquidity = isPutTokenWeth ? _totalLiquidity * ethPrice : _totalLiquidity;

        const utilisedLiquidity = totalLiquidity - availableLiquidity;
        return {
          pair: [callTokenData, putTokenData] as [TokenData, TokenData],
          address: getAddress(address),
          chainId,
          chainName: CHAINS[chainId].name,
          pairLabel,
          deprecated,
          liquidity: {
            availableLiquidity,
            totalLiquidity,
          },
          openInterest: isPutTokenWeth ? openInterest * ethPrice : openInterest,
          utilization: (1 - availableLiquidity / totalLiquidity) * 100,
          volume24h: volume24h,
          totalEarnings: premiums24h, // check if we want to use totalPremium or totalFees
          earningsApr: {
            high: (premiums24h / utilisedLiquidity) * 365 * 100,
            low: (premiums24h / totalLiquidity) * 365 * 100,
          },
          optionsPricing: getAddress(optionsPricing),
          primePool: getAddress(primePool),
          isMemePair,
          circulatingSupply,
          tickSpacing,
          isLimitOrdersEnabled,
        };
      },
    );
}

const QUERY_PATH = 'v1.1/clamm/option-markets';

const useMarketsData = ({ chainIds = [DEFAULT_CHAIN_ID] }: { chainIds?: SupportedChainIdType[] }) => {
  const { prices } = usePricesStore();
  const ethPrice: number = prices.get('ETH') ?? 0;
  const {
    data: responseData,
    error,
    isError,
    refetch,
    isLoading,
  } = useQuery<OptionMarket[]>({
    queryKey: ['option-markets', chainIds.toString()],
    queryFn: async () => {
      const url = new URL(`${VARROCK_BASE_API_URL}/${QUERY_PATH}`);

      url.searchParams.set('chains', chainIds.toString());

      const responseData = await fetch(url)
        .then(async (res) => {
          const response = (await res.json()) as OptionMarket[];
          return response;
        })
        .catch((err) => {
          console.error(err);
          return [];
        });

      return responseData;
    },
    staleTime: 1000 * 5,
  });

  const marketData = useMemo(() => {
    const marketData: MarketData[] = responseData ? getMarketData(responseData, { ethPrice }) : [];

    return marketData;
  }, [responseData, ethPrice]);

  return { data: marketData, error, isError, refetch, isLoading };
};

export default useMarketsData;
