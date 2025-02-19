import { Purchase } from '@/types/varrock';

import { useQuery } from '@tanstack/react-query';
import { OnChangeFn, RowSelectionState } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { Address, formatUnits, Hex, zeroAddress } from 'viem';
import { arbitrum, base, berachainTestnetbArtio, blast, mantle, sonic } from 'viem/chains';
import { useAccount } from 'wagmi';

import { getBuyPositions } from '@/utils/actions/varrock/positions';

import { useToast } from '@/components/ui/use-toast';

import useStrikesStore from '../../../../hooks/store/useStrikesStore';
import useLocalStorage from '@/app/[locale]/hooks/useLocalStorage';

import { VARROCK_BASE_API_URL } from '@/consts/env';

export interface BuyPositionType extends Purchase {
  breakeven: number;
  pnl: {
    pnlUsdValue: number;
    pnlReadable: number;
    symbol: string;
    pnlInQuoteAsset: number;
  };
  expiry: number;
  premiumUsdValue: number;
  premiumInQuoteAsset: number;
  optionsAmount: number;
  circulatingSupply: number;
  strikePriceUsd: number;
  isMemePair: boolean;
}

export interface OptionExerciseData {
  profit?: string;
  token?: Address;
  swapData?: Hex[];
  swappers?: Address[];
  tx: {
    to?: Address;
    data: Hex;
  };
}

export enum Swapper {
  AUTO = 'auto',
  DIRECT = 'direct',
  ONE_INCH = '1inch',
  KYBERSWAP = 'kyberswap',
  KODIAK = 'kodiak',
  SUSHI_API = 'sushi-api',
}

export const SwapperDisplayLabels = {
  [Swapper.AUTO]: 'Auto (beta)',
  [Swapper.DIRECT]: 'Direct',
  [Swapper.ONE_INCH]: '1inch',
  [Swapper.KYBERSWAP]: 'KyberSwap',
  [Swapper.KODIAK]: 'Kodiak',
  [Swapper.SUSHI_API]: 'Sushi API',
};

const DirectSwapperByChainId = {
  [arbitrum.id]: 'uniswap',
  [base.id]: 'uniswap',
  [mantle.id]: 'agni',
  [blast.id]: 'thruster',
};

const getAvailableSwappers = (chainId: number): Swapper[] => {
  const baseSwappers = [Swapper.AUTO, Swapper.DIRECT];

  // using first item as default swapper
  switch (chainId) {
    case arbitrum.id:
    case base.id:
      return [...baseSwappers];
    case mantle.id:
    case blast.id:
      return [Swapper.KYBERSWAP, ...baseSwappers];
    case berachainTestnetbArtio.id:
      return [Swapper.KODIAK];
    case sonic.id:
      return [Swapper.SUSHI_API];
    default:
      return baseSwappers;
  }
};

interface ExercisePreparation {
  tx: Hex | null;
  error: string | null;
  isPreparing: boolean;
}

const useBuyPositionsData = () => {
  const { address } = useAccount();
  const { selectedMarket, markPrice, quoteAssetPriceUsd, markPriceUsd } = useStrikesStore();
  const { chainId, address: optionsMarketAddress, pair, circulatingSupply, isMemePair } = selectedMarket;
  const putToken = pair?.[1];
  const [selectedPositions, setSelectedPositions] = useState<Record<string, boolean>>({});
  const [exercisePreparations, setExercisePreparations] = useState<Record<string, ExercisePreparation>>({});
  const { toast } = useToast();

  const availableSwappers = useMemo(() => getAvailableSwappers(chainId), [chainId]);

  const defaultSwapper = availableSwappers[0];

  const [selectedSwapperId, setSelectedSwapperId] = useLocalStorage<Swapper>('exercise-swapper-id', defaultSwapper);

  const defaultSlippage = isMemePair ? 5 : 2;

  const [slippage, setSlippage] = useLocalStorage<number>('exercise-slippage', defaultSlippage);

  const resetExercisePositions = useCallback(() => {
    setSelectedPositions({});
    setExercisePreparations({});
  }, []);

  const showNonExercisablePositionToast = useCallback(() => {
    toast({
      title: 'Position is not exercisable.',
      variant: 'destructive',
    });
  }, [toast]);

  const {
    data: positions = [],
    isLoading,
    refetch,
  } = useQuery<BuyPositionType[]>({
    queryKey: ['purchases', address, chainId, optionsMarketAddress, circulatingSupply],
    queryFn: async () => {
      const positionsResponse = await getBuyPositions({
        user: address || zeroAddress,
        chainId,
        optionMarket: optionsMarketAddress,
        first: 1000,
        skip: 0,
      });

      return positionsResponse.map((position) => {
        const { premium, token, type, strike, size, meta } = position;
        const { decimals } = token;
        const sizeReadable = Number(formatUnits(BigInt(size), decimals));
        const isCall = type.toLowerCase() === 'call';

        const sizeUsdValue = (isCall ? sizeReadable * markPrice : sizeReadable) * quoteAssetPriceUsd;

        const premiumReadable = Number(formatUnits(BigInt(premium), decimals));
        const premiumInQuoteAsset = isCall ? premiumReadable * markPrice : premiumReadable;
        const premiumUsdValue = premiumInQuoteAsset * quoteAssetPriceUsd;

        const optionsAmount =
          type.toLowerCase() === 'put' ? Number(sizeUsdValue) / (strike * quoteAssetPriceUsd) : sizeReadable;

        const breakeven =
          type.toLowerCase() === 'put'
            ? Number(strike * quoteAssetPriceUsd) - premiumUsdValue / optionsAmount
            : Number(strike * quoteAssetPriceUsd) + premiumUsdValue / optionsAmount;

        const pnlInQuoteAsset = Math.max((isCall ? markPrice - strike : strike - markPrice) * optionsAmount, 0);
        const pnlUsdValue = pnlInQuoteAsset * quoteAssetPriceUsd;

        const pnlReadable =
          type.toLowerCase() === 'put' ? pnlUsdValue / markPriceUsd : pnlUsdValue / quoteAssetPriceUsd;

        return {
          ...position,
          breakeven,
          pnl: {
            pnlUsdValue,
            pnlReadable,
            pnlInQuoteAsset: pnlInQuoteAsset,
            symbol: isCall ? pair[1].symbol : pair[0].symbol,
          },
          expiry: meta.expiry,
          premiumUsdValue,
          premiumInQuoteAsset: premiumInQuoteAsset,
          optionsAmount,
          circulatingSupply,
          strikePriceUsd: strike * quoteAssetPriceUsd,
          isMemePair,
          putToken,
        };
      });
    },
    staleTime: 2000,
    refetchInterval: 2000,
  });

  const prepareExercise = useCallback(
    async (tokenId: string) => {
      if (!address || !chainId || !optionsMarketAddress) {
        return;
      }

      setExercisePreparations((prev) => ({
        ...prev,
        [tokenId]: { ...prev[tokenId], isPreparing: true, error: null },
      }));

      const position = positions.find((position) => position.meta.tokenId === tokenId);
      if (!position) {
        throw new Error('Position not found');
      }

      const { strikePriceUsd } = position;

      try {
        const swapperId =
          selectedSwapperId === Swapper.DIRECT
            ? DirectSwapperByChainId[chainId as keyof typeof DirectSwapperByChainId]
            : selectedSwapperId;

        const url = new URL(`${VARROCK_BASE_API_URL}/clamm/exercise/prepare`);
        url.searchParams.set('chainId', chainId.toString());
        url.searchParams.set('optionMarket', optionsMarketAddress);
        url.searchParams.set('optionId', tokenId);
        url.searchParams.set('swapperId', swapperId);
        url.searchParams.set('slippage', slippage.toString() || '5');

        const res = await fetch(url).then((res) => res.json());

        if (res['error']) {
          throw new Error(res['error']);
        }

        if (res['profit'] === '0') {
          throw new Error('Profit too less!');
        }

        if (res['simulationError']) {
          throw new Error(res['simulationError']);
        }

        const _res: OptionExerciseData = res;
        if (!_res.tx.data) {
          throw new Error('Failed to prepare exercise. Please try again');
        }

        setSelectedPositions((prev) => ({
          ...prev,
          [tokenId]: true,
        }));

        toast({
          title: 'Exercise Preparation Complete',
          description: (
            <>
              Position <strong>{strikePriceUsd.toFixed(2)}</strong> is ready for exercise.
            </>
          ),
        });

        setExercisePreparations((prev) => ({
          ...prev,
          [tokenId]: { tx: _res.tx.data, error: null, isPreparing: false },
        }));
      } catch (error) {
        console.error('Error preparing exercise:', error);
        setExercisePreparations((prev) => ({
          ...prev,
          [tokenId]: { tx: null, error: (error as Error).message, isPreparing: false },
        }));

        setSelectedPositions((prev) => {
          const { [tokenId]: _, ...rest } = prev;
          return rest;
        });

        toast({
          title: 'Exercise Preparation Failed',
          description: (
            <>
              Failed to prepare exercise for position <strong>{strikePriceUsd.toFixed(2)}</strong>.{' '}
              {typeof (error as Error).message == 'string' ? (error as Error).message : ''}
            </>
          ),
          variant: 'destructive',
        });
      }
    },
    [address, chainId, optionsMarketAddress, selectedSwapperId, slippage, positions, toast],
  );
  const onRowSelectionChange: OnChangeFn<RowSelectionState> = useCallback(
    (update) => {
      //@ts-ignore
      const newSelection = update(selectedPositions) as Record<string, boolean>;

      // Prepare exercise for newly selected positions or retry failed preparations
      Object.entries(newSelection).forEach(([tokenId, isSelected]) => {
        if (isSelected) {
          const currentPrep = exercisePreparations[tokenId];
          if (!currentPrep || (currentPrep.error !== null && !currentPrep.isPreparing)) {
            prepareExercise(tokenId);
          }
        }
      });

      // Remove preparation for unselected positions
      Object.entries(selectedPositions).forEach(([tokenId, wasSelected]) => {
        if (wasSelected && !newSelection[tokenId]) {
          setExercisePreparations((prev) => {
            const { [tokenId]: _, ...rest } = prev;
            return rest;
          });
          setSelectedPositions((prev) => {
            const { [tokenId]: _, ...rest } = prev;
            return rest;
          });
        }
      });
    },
    [selectedPositions, exercisePreparations, prepareExercise],
  );

  const exerciseTxs = Object.values(exercisePreparations)
    .filter((prep) => prep.tx !== null)
    .map((prep) => prep.tx as Hex);

  const isPreparing = Object.values(exercisePreparations).some((prep) => prep.isPreparing);

  return {
    positions,
    exerciseTxs,
    isLoading,
    selectedPositions,
    onRowSelectionChange,
    refetchPositions: refetch,
    exerciseSettings: {
      selectedSwapperId,
      setSelectedSwapperId,
      slippage,
      setSlippage,
      defaultSlippage,
      defaultSwapper,
      availableSwappers,
    },
    isPreparing,
    exercisePreparations,
    resetExercisePositions,
    showNonExercisablePositionToast,
  };
};

export default useBuyPositionsData;
