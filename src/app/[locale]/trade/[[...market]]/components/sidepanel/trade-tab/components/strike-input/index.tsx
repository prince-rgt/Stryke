import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { formatUnits, parseUnits, zeroAddress } from 'viem';
import { useAccount, useReadContract } from 'wagmi';

import { calculatePurchaseCost } from '@/utils/actions/varrock/price';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';

import useStrikesStore, { StrikeDisplay } from '../../../../../hooks/store/useStrikesStore';
import { ExpiryOption, TTL_TO_EXPIRY, useTradeStore } from '../../hooks/store/useTradeStore';

import DopexV2OptionMarketV2 from '@/abi/DopexV2OptionMarketV2';

const StrikeInput = ({ strikeData }: { strikeData: StrikeDisplay }) => {
  const { markPrice, selectedMarket } = useStrikesStore();
  const { token, strikePrice, availableLiquidity, availableLiquidityWeekly } = strikeData;

  const {
    selectedTTL,
    setPurchaseMetaByStrike,
    unsetPurchaseMetaByStrike,
    setInputValue,
    inputValues,
    unsetInputValue,
    setFetchingQuotes,
    setErrors,
    errors,
  } = useTradeStore();

  const maxValue =
    TTL_TO_EXPIRY[selectedTTL] === ExpiryOption.OneWeek
      ? availableLiquidityWeekly.amountTokenBigInt
      : availableLiquidity.amountTokenBigInt;
  const { address } = useAccount();
  const { chainId, address: optionMarketAddress } = selectedMarket;
  const { decimals } = token;
  const value = inputValues?.get(strikePrice)?.amount || BigInt(0);
  const [localInputValue, setLocalInputValue] = useState<string>(formatUnits(value, token.decimals));

  const { data } = useReadContract({
    abi: DopexV2OptionMarketV2,
    functionName: 'getCurrentPricePerCallAsset',
    address: optionMarketAddress,
    args: [selectedMarket.primePool],
  });

  useEffect(() => {
    setLocalInputValue(formatUnits(value, token.decimals));
  }, [value, token.decimals]);

  const setError = useCallback(
    (err: string | null) => {
      {
        if (err) {
          setErrors(errors?.set(strikePrice, err) || new Map([[strikePrice, err]]));
        } else if (errors?.has(strikePrice)) {
          const newErrors = new Map(errors);
          newErrors.delete(strikePrice);
          setErrors(newErrors);
        }
      }
    },
    [errors, setErrors, strikePrice],
  );

  useEffect(() => {
    if (value > maxValue) {
      setError('Insufficient Liquidity');
    } else {
      setError(null);
    }
  }, [maxValue, setError, value, selectedTTL]);

  const [amountDebounced] = useDebounce(
    strikePrice < markPrice
      ? (value * parseUnits('1', decimals)) / parseUnits(strikePrice.toFixed(decimals), decimals)
      : value,
    200,
  );
  const [ttlDebounced] = useDebounce(selectedTTL, 1000);

  const { data: premiumAndFees, isLoading: fetchingQuotes } = useQuery({
    queryKey: [
      'purchase-cost',
      address,
      // strikeData?.tickLower,
      // strikeData?.tickUpper,
      ttlDebounced, // debounce ttl
      optionMarketAddress,
      amountDebounced.toString(),
    ],
    queryFn: async () =>
      await calculatePurchaseCost({
        type: strikePrice > markPrice ? 'call' : 'put',
        markPrice: data ? Number(formatUnits(data, selectedMarket.pair[1].decimals)) : strikePrice,
        chainId,
        optionMarket: optionMarketAddress ?? zeroAddress,
        strike: strikePrice,
        amount: formatUnits(amountDebounced, token.decimals) as any,
        ttl: ttlDebounced,
        user: address ?? zeroAddress,
      }),
  });

  useEffect(() => {
    setFetchingQuotes(fetchingQuotes);
  }, [fetchingQuotes, setFetchingQuotes]);

  useEffect(() => {
    if (premiumAndFees) {
      setPurchaseMetaByStrike(strikePrice, premiumAndFees);
    } else {
      unsetPurchaseMetaByStrike(strikePrice);
    }
  }, [premiumAndFees, strikePrice, setPurchaseMetaByStrike, unsetPurchaseMetaByStrike]);

  // Separate effect to unset the values, as combining with above was causing issues
  useEffect(() => {
    return () => {
      unsetPurchaseMetaByStrike(strikePrice);
      unsetInputValue(strikePrice);
      setError(null);
    };
  }, [unsetPurchaseMetaByStrike, unsetInputValue, strikePrice, setError]);

  const updateInputValue = useCallback(
    (value: bigint) => {
      setInputValue(strikePrice, { amount: value, token });
    },
    [setInputValue, strikePrice, token],
  );

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value.replace(/,/g, '.');
    if (newValue === '.') {
      newValue = '0.';
    }
    if (parseUnits(newValue, decimals) > maxValue) {
      setError('Insufficient Liquidity');
    } else {
      setError(null);
    }
    setLocalInputValue(newValue);
    updateInputValue(parseUnits(newValue, decimals));
  };

  return (
    <>
      <Input
        error={value && value > maxValue ? true : false}
        value={localInputValue}
        type="number"
        onChange={handleValueChange}
        className="ml-md"
        variant={'ghost'}
      />
      {/* {token.symbol} */}
      <Button
        className="ml-1"
        onClick={() => {
          setLocalInputValue(formatUnits(maxValue, decimals));
          updateInputValue(maxValue);
        }}
        size={'sm'}
        variant={'secondary'}>
        <Typography variant="extra-small-regular">Max</Typography>
      </Button>
    </>
  );
};

export default StrikeInput;
