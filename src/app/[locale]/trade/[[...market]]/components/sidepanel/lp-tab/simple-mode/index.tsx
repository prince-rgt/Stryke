import { TokenData } from '@/types';

import { ArrowBottomRightIcon, ArrowTopRightIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useAccount } from 'wagmi';

import { GeneratedStrike } from '@/utils/math/generateStrikes';
import { getTokenLogoURI } from '@/utils/tokens';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NumberDisplay from '@/components/ui/number-display';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Typography } from '@/components/ui/typography';

import useStrikesStore from '../../../../hooks/store/useStrikesStore';
import useTokenBalances from '../../../../hooks/useTokenBalances';
import { InputValue, useLpStore } from '../hooks/store/useLpStore';

import { DEFAULT_CHAIN_ID } from '@/consts/chains';
import { MULTICALL_LIMIT_BY_CHAIN } from '@/consts/clamm';

enum RangeType {
  Narrow = 'NARROW',
  Wide = 'WIDE',
}

interface TokenPair {
  0: TokenData;
  1: TokenData;
}

interface SimpleLpModeProps {
  pair: TokenPair;
  markPrice: number;
  generatedStrikes: GeneratedStrike[];
}

const SimpleLpMode: React.FC<SimpleLpModeProps> = ({ pair, markPrice, generatedStrikes }) => {
  const [rangeType, setRangeType] = useState<RangeType>(RangeType.Narrow);
  const { setInputValues } = useLpStore();
  const { selectedMarket, quoteAssetPriceUsd, markPriceUsd, displayStrikesAsMarketCap } = useStrikesStore();
  const { isMemePair, circulatingSupply } = selectedMarket;

  const callToken = pair?.[0];
  const putToken = pair?.[1];

  const { tokenBalances } = useTokenBalances({});
  const { address: userAddress, chainId = DEFAULT_CHAIN_ID } = useAccount();

  const { callToken: callTokenBalance = BigInt(0), putToken: putTokenBalance = BigInt(0) } = tokenBalances ?? {};

  const [callTokenInput, setCallTokenInput] = useState<bigint>(BigInt(0));
  const [localCallInputValue, setLocalCallInputValue] = useState<string>(
    formatUnits(callTokenInput, callToken.decimals),
  );
  const handleCallTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    if (newValue === '.') {
      newValue = '0.';
    }
    setLocalCallInputValue(newValue);
    setCallTokenInput(parseUnits(newValue, callToken.decimals));
  };

  const [putTokenInput, setPutTokenInput] = useState<bigint>(BigInt(0));
  const [localPutInputValue, setLocalPutInputValue] = useState<string>(formatUnits(putTokenInput, putToken.decimals));
  const handlePutTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    if (newValue === '.') {
      newValue = '0.';
    }
    setLocalPutInputValue(newValue);
    setPutTokenInput(parseUnits(newValue, putToken.decimals));
  };

  const handleCallPercentageClick = useCallback(
    (percentage: number) => {
      const value = (callTokenBalance * BigInt(percentage)) / BigInt(100);
      setLocalCallInputValue(formatUnits(value, callToken.decimals));
      setCallTokenInput(value);
    },
    [callToken.decimals, callTokenBalance],
  );

  const handlePutPercentageClick = useCallback(
    (percentage: number) => {
      const value = (putTokenBalance * BigInt(percentage)) / BigInt(100);
      setLocalPutInputValue(formatUnits(value, putToken.decimals));
      setPutTokenInput(value);
    },
    [putToken.decimals, putTokenBalance],
  );

  const { lowerPrice, upperPrice } = useMemo(() => {
    const percentage = rangeType === RangeType.Narrow ? 7.5 : 15;

    // Find strikes closest to target percentage on both sides
    const lowerStrikes = generatedStrikes
      .filter((strike) => strike.strike < markPrice)
      .sort((a, b) => {
        const aPerc = ((markPrice - a.strike) / markPrice) * 100;
        const bPerc = ((markPrice - b.strike) / markPrice) * 100;
        return Math.abs(aPerc - percentage) - Math.abs(bPerc - percentage);
      });

    const upperStrikes = generatedStrikes
      .filter((strike) => strike.strike >= markPrice)
      .sort((a, b) => {
        const aPerc = ((a.strike - markPrice) / markPrice) * 100;
        const bPerc = ((b.strike - markPrice) / markPrice) * 100;
        return Math.abs(aPerc - percentage) - Math.abs(bPerc - percentage);
      });

    return {
      lowerPrice: lowerStrikes[0]?.strike ?? markPrice,
      upperPrice: upperStrikes[0]?.strike ?? markPrice,
    };
  }, [rangeType, markPrice, generatedStrikes]);

  useEffect(() => {
    const inputValues = new Map<number, InputValue>();
    const maxStrikes = MULTICALL_LIMIT_BY_CHAIN[chainId];
    const percentage = rangeType === RangeType.Narrow ? 7.5 : 15;

    // First separate all strikes into calls and puts
    const allCallStrikes = generatedStrikes.filter((strike) => strike.strike >= markPrice);
    const allPutStrikes = generatedStrikes.filter((strike) => strike.strike < markPrice);

    // Then filter by percentage from mark price
    let callStrikes = allCallStrikes.filter((strike) => ((strike.strike - markPrice) / markPrice) * 100 <= percentage);
    let putStrikes = allPutStrikes.filter((strike) => ((markPrice - strike.strike) / markPrice) * 100 <= percentage);

    // If total strikes exceed limit, scale down proportionally
    const totalStrikes = callStrikes.length + putStrikes.length;
    if (totalStrikes > maxStrikes) {
      const ratio = callStrikes.length / totalStrikes;
      const maxCallStrikes = Math.floor(maxStrikes * ratio);
      const maxPutStrikes = maxStrikes - maxCallStrikes;

      if (callStrikes.length > maxCallStrikes) {
        const callScaleFactor = (callStrikes.length - 1) / maxCallStrikes;
        callStrikes = callStrikes
          .filter(
            (_, index, array) => index === 0 || index === array.length - 1 || index % Math.ceil(callScaleFactor) === 0,
          )
          .slice(0, maxCallStrikes);
      }

      if (putStrikes.length > maxPutStrikes) {
        const putScaleFactor = (putStrikes.length - 1) / maxPutStrikes;
        putStrikes = putStrikes
          .filter(
            (_, index, array) => index === 0 || index === array.length - 1 || index % Math.ceil(putScaleFactor) === 0,
          )
          .slice(0, maxPutStrikes);
      }
    }

    if (callTokenInput && callTokenInput !== BigInt(0) && callStrikes.length > 0) {
      const amountPerStrike = callTokenInput / BigInt(callStrikes.length);
      callStrikes.forEach(({ strike, tickLower, tickUpper }) => {
        inputValues.set(strike, {
          token: callToken,
          amount: amountPerStrike,
          tickLower,
          tickUpper,
        });
      });
    }

    if (putTokenInput && putTokenInput !== BigInt(0) && putStrikes.length > 0) {
      const amountPerStrike = putTokenInput / BigInt(putStrikes.length);
      putStrikes.forEach(({ strike, tickLower, tickUpper }) => {
        inputValues.set(strike, {
          token: putToken,
          amount: amountPerStrike,
          tickLower,
          tickUpper,
        });
      });
    }

    setInputValues(inputValues);
  }, [
    callToken,
    callTokenInput,
    chainId,
    generatedStrikes,
    markPrice,
    putToken,
    putTokenInput,
    rangeType,
    setInputValues,
  ]);

  const getDisplayValue = useCallback(
    (price: number) => {
      if (displayStrikesAsMarketCap) {
        return <NumberDisplay precision={4} value={circulatingSupply * price * quoteAssetPriceUsd} format="usd" />;
      }
      return (
        <NumberDisplay
          showDecimalZerosSubscript
          value={isMemePair ? price * quoteAssetPriceUsd : price}
          precision={isMemePair ? 7 : 4}
          format={displayStrikesAsMarketCap ? 'usd' : 'tokenAmount'}
        />
      );
    },
    [circulatingSupply, displayStrikesAsMarketCap, isMemePair, quoteAssetPriceUsd],
  );

  return (
    <div className="flex flex-col space-y-md bg-secondary p-md">
      <div className="space-y-md">
        <Typography className="text-muted-foreground" variant="small-medium">
          Range Type
        </Typography>
        <ToggleGroup
          value={rangeType}
          type="single"
          size="lg"
          className="grid h-12 w-full grid-cols-2 rounded-md"
          onValueChange={(value: RangeType) => value && setRangeType(value)}>
          <ToggleGroupItem value={RangeType.Narrow} className="rounded-sm">
            <Typography variant="small-medium">Narrow (±7.5%)</Typography>
          </ToggleGroupItem>
          <ToggleGroupItem value={RangeType.Wide} className="rounded-sm">
            <Typography variant="small-medium">Wide (±15%)</Typography>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex items-center space-x-1">
        <div className="flex w-1/2 items-center space-x-1 bg-subtle/30 px-1 py-[7px]">
          <ArrowBottomRightIcon className="mr-md h-4 w-4 text-destructive" />
          <Typography variant="small-medium">
            {displayStrikesAsMarketCap || isMemePair ? (
              <>
                {getDisplayValue(lowerPrice)} - {getDisplayValue(markPrice)}
                {!displayStrikesAsMarketCap && isMemePair && ` ${putToken.symbol}`}
              </>
            ) : (
              `${lowerPrice.toFixed(2)} - ${markPrice.toFixed(2)}`
            )}
          </Typography>
        </div>
        <div className="flex flex-1 items-center">
          <Image
            width={16}
            height={16}
            src={getTokenLogoURI(putToken)}
            alt={putToken.symbol}
            className="ml-md h-4 w-4 rounded-full"
          />
          <Input
            disabled={!userAddress}
            value={localPutInputValue}
            type="number"
            onChange={handlePutTokenChange}
            className="ml-1"
          />
          <div className="relative inline-block">
            <div className="group relative inline-block items-center">
              <Button
                className="peer ml-0.5"
                onClick={() => handlePutPercentageClick(100)}
                size="sm"
                variant="secondary">
                <Typography variant="extra-small-regular">Max</Typography>
              </Button>
              <div className="pointer-events-none absolute -left-[68px] top-0.5 flex items-center space-x-1 bg-muted opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100 peer-hover:pointer-events-auto">
                <Button
                  onClick={() => handlePutPercentageClick(50)}
                  className="border border-border"
                  size="sm"
                  variant="secondary">
                  <Typography variant="extra-small-regular">50%</Typography>
                </Button>
                <Button
                  onClick={() => handlePutPercentageClick(75)}
                  className="border border-border"
                  size="sm"
                  variant="secondary">
                  <Typography variant="extra-small-regular">75%</Typography>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-1">
        <div className="flex w-1/2 items-center space-x-1 bg-subtle/30 px-1 py-[7px]">
          <ArrowTopRightIcon className="mr-md h-4 w-4 text-success" />
          <Typography variant="small-medium">
            {displayStrikesAsMarketCap || isMemePair ? (
              <>
                {getDisplayValue(markPrice)} - {getDisplayValue(upperPrice)}
                {!displayStrikesAsMarketCap && isMemePair && ` ${putToken.symbol}`}
              </>
            ) : (
              `${markPrice.toFixed(2)} - ${upperPrice.toFixed(2)}`
            )}
          </Typography>
        </div>
        <div className="flex flex-1 items-center">
          <Image
            width={16}
            height={16}
            src={getTokenLogoURI(callToken)}
            alt={callToken.symbol}
            className="ml-md h-4 w-4 rounded-full"
          />
          <Input
            disabled={!userAddress}
            value={localCallInputValue}
            type="number"
            onChange={handleCallTokenChange}
            className="ml-1"
          />
          <div className="relative inline-block">
            <div className="group relative inline-block items-center">
              <Button
                className="peer ml-0.5"
                onClick={() => handleCallPercentageClick(100)}
                size="sm"
                variant="secondary">
                <Typography variant="extra-small-regular">Max</Typography>
              </Button>
              <div className="pointer-events-none absolute -left-[68px] top-0.5 flex items-center space-x-1 bg-muted opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100 peer-hover:pointer-events-auto">
                <Button
                  onClick={() => handleCallPercentageClick(50)}
                  className="border border-border"
                  size="sm"
                  variant="secondary">
                  <Typography variant="extra-small-regular">50%</Typography>
                </Button>
                <Button
                  onClick={() => handleCallPercentageClick(75)}
                  className="border border-border"
                  size="sm"
                  variant="secondary">
                  <Typography variant="extra-small-regular">75%</Typography>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleLpMode;
