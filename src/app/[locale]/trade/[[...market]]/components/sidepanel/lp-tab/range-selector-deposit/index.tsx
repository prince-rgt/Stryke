import { ArrowBottomRightIcon, ArrowTopRightIcon } from '@radix-ui/react-icons';
import { sortBy } from 'lodash';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useToggle } from 'react-use';
import { formatUnits, parseUnits } from 'viem';
import { useAccount } from 'wagmi';

import { GeneratedStrike } from '@/utils/math/generateStrikes';
import { getTokenLogoURI } from '@/utils/tokens';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NumberDisplay, { formatForDisplay } from '@/components/ui/number-display';
import { Switch } from '@/components/ui/switch';
import { Typography } from '@/components/ui/typography';

import useStrikesStore from '../../../../hooks/store/useStrikesStore';
import useTokenBalances from '../../../../hooks/useTokenBalances';
import { InputValue, useLpStore } from '../hooks/store/useLpStore';

import { DEFAULT_CHAIN_ID } from '@/consts/chains';
import { MULTICALL_LIMIT_BY_CHAIN } from '@/consts/clamm';

import { SIDE_PANEL_WIDTH } from '../..';
import RangeSelector, { Domain } from '../../../range-selector';

const RangeSelectorDeposit = ({ generatedStrikes }: { generatedStrikes: GeneratedStrike[] }) => {
  const { markPrice, quoteAssetPriceUsd, selectedMarket, strikes, markPriceUsd } = useStrikesStore();

  const { pair, isMemePair } = selectedMarket;

  const [displayValuesUsd, toggleDisplayValuesUsd] = useToggle(isMemePair ? true : false);

  const callToken = pair?.[0];
  const putToken = pair?.[1];

  const { setInputValues, inputValues } = useLpStore();

  const { tokenBalances } = useTokenBalances({});
  const { address: userAddress, chainId = DEFAULT_CHAIN_ID } = useAccount();

  const { callToken: callTokenBalance = BigInt(0), putToken: putTokenBalance = BigInt(0) } = tokenBalances ?? {};

  const [zoomLevel, setZoomLevel] = useState<number>(1);

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

  // strikes chain plus generated strikes
  const currentStrikes = useMemo(() => {
    return generatedStrikes.map(({ strike, tickLower, tickUpper }) => {
      const existingStrike = strikes.find((strikeData) => strikeData.strikePrice === strike);

      let totalLiquidityUsd = 0;
      let liquidityAvailableUsd = 0;
      let liquidityUsedUsd = 0;
      if (existingStrike) {
        const { availableLiquidity, totalLiquidity } = existingStrike;
        totalLiquidityUsd = totalLiquidity.amountUSD;
        liquidityAvailableUsd = availableLiquidity.amountUSD;
        liquidityUsedUsd = totalLiquidityUsd - liquidityAvailableUsd;
      }

      return {
        tickLower,
        tickUpper,
        totalLiquidityUsd,
        liquidityAvailableUsd,
        liquidityUsedUsd,
        strikePrice: strike,
      };
    });
  }, [generatedStrikes, strikes]);

  const rangeSelectorData = useMemo(
    () =>
      currentStrikes.length
        ? sortBy(currentStrikes, 'strikePrice').map((strike) => ({
            strikePrice: strike.strikePrice,
            // set the metric responsible for the bar height
            value: strike.totalLiquidityUsd,
          }))
        : [],

    [currentStrikes],
  );

  // console.log({ rangeSelectorData, generatedStrikes, currentStrikes, poolTickSpacing, strikes });

  // selected x-axis value start and end points
  const [selectedDomain, setSelectedDomain] = useState<Domain | undefined>();
  const hasSetDomain = useRef(false);

  useEffect(() => {
    if (rangeSelectorData?.length > 0 && !hasSetDomain.current) {
      setSelectedDomain({
        start: rangeSelectorData[0].strikePrice,
        end: rangeSelectorData[rangeSelectorData.length - 1].strikePrice,
      });
      // Mark that the domain has been set, preventing future executions
      hasSetDomain.current = true;
    }
  }, [rangeSelectorData]);

  const onDomainChange = (domain?: Domain) => {
    setSelectedDomain(domain);
  };

  useEffect(() => {
    const inputValues = new Map<number, InputValue>();
    if (selectedDomain) {
      let selectedStrikes = currentStrikes.filter(
        (strike) => strike.strikePrice >= selectedDomain.start && strike.strikePrice <= selectedDomain.end,
      );

      // Scale down selectedStrikes for multicall3 based on chain
      if (selectedStrikes.length > MULTICALL_LIMIT_BY_CHAIN[chainId]) {
        const scaleFactor = (selectedStrikes.length - 2) / (MULTICALL_LIMIT_BY_CHAIN[chainId] - 2);
        const filteredStrikes = selectedStrikes.filter((_, index) => {
          if (index === 0 || index === selectedStrikes.length - 1) {
            return true; // Keep the start and end strikes
          }
          return index % Math.ceil(scaleFactor) === 0;
        });

        selectedStrikes = [
          selectedStrikes[0], // Start strike
          ...filteredStrikes.slice(1, -1), // Evenly removed strikes
          selectedStrikes[selectedStrikes.length - 1], // End strike
        ];
      }

      const callStrikes = selectedStrikes.filter(({ strikePrice }) => strikePrice >= markPrice);
      const putStrikes = selectedStrikes.filter(({ strikePrice }) => strikePrice < markPrice);

      if (callTokenInput && callStrikes.length > 0) {
        const callTokenInputPerStrike = callTokenInput / BigInt(callStrikes.length);

        callStrikes.forEach(({ strikePrice, tickLower, tickUpper }) => {
          inputValues.set(strikePrice, { amount: callTokenInputPerStrike, token: callToken, tickLower, tickUpper });
        });
      }

      if (putTokenInput && putStrikes.length > 0) {
        const putTokenInputPerStrike = putTokenInput / BigInt(putStrikes.length);

        putStrikes.forEach(({ strikePrice, tickLower, tickUpper }) => {
          inputValues.set(strikePrice, { amount: putTokenInputPerStrike, token: putToken, tickLower, tickUpper });
        });
      }
    }
    setInputValues(inputValues);
  }, [
    callToken,
    callTokenInput,
    chainId,
    currentStrikes,
    markPrice,
    putToken,
    putTokenInput,
    selectedDomain,
    setInputValues,
  ]);

  console.log(inputValues.size);

  const handleZoom = useCallback((newScale: number) => {
    const clampedScale = Math.max(1, Math.min(4, newScale));
    setZoomLevel(clampedScale);
  }, []);

  const zoomIn = useCallback(() => handleZoom(zoomLevel * 1.2), [zoomLevel, handleZoom]);
  const zoomOut = useCallback(() => handleZoom(zoomLevel / 1.2), [zoomLevel, handleZoom]);
  const resetZoom = useCallback(() => handleZoom(1), [handleZoom]);

  return (
    <div className="flex flex-col space-y-md bg-secondary p-md">
      <div className="flex items-center justify-between">
        <Typography className="text-muted-foreground" variant={'small-medium'}>
          Select Range
        </Typography>
        {isMemePair && (
          <div className="flex items-center space-x-md">
            <Typography variant="small-medium">Display values in USD</Typography>
            <Switch checked={displayValuesUsd} onCheckedChange={toggleDisplayValuesUsd} />
          </div>
        )}
        <div className="zoom-controls flex flex-row">
          <Button onClick={zoomIn} className="zoom-btn" variant="ghost">
            +
          </Button>
          <Button onClick={zoomOut} className="zoom-btn mx-2" variant="ghost">
            -
          </Button>
          <Button onClick={resetZoom} className="zoom-btn" variant="ghost">
            Reset
          </Button>
        </div>
      </div>

      {rangeSelectorData.length && (
        <div className="-mx-2">
          <RangeSelector
            onDomainChange={onDomainChange}
            dimensions={{ width: SIDE_PANEL_WIDTH - 26, height: 82 }}
            markPrice={markPrice}
            data={rangeSelectorData}
            tickFormatter={
              displayValuesUsd
                ? (value) => `${formatForDisplay({ value: value * quoteAssetPriceUsd, precision: 5, format: 'usd' })}`
                : (value) => value.toFixed(2)
            }
            zoomLevel={zoomLevel}
          />
        </div>
      )}
      <div className="flex items-center space-x-md">
        <div className="flex w-1/2 justify-between">
          <Typography className="text-muted-foreground" variant={'small-medium'}>
            Lower Strike
          </Typography>
          <Typography variant={'small-medium'}>
            {isMemePair ? (
              <>
                <NumberDisplay
                  showDecimalZerosSubscript
                  precision={displayValuesUsd ? 7 : 10}
                  value={displayValuesUsd ? (selectedDomain?.start ?? 0) * quoteAssetPriceUsd : selectedDomain?.start}
                  format={displayValuesUsd ? 'usd' : 'tokenAmount'}
                />
                {!displayValuesUsd && ` ${putToken.symbol}`}
              </>
            ) : (
              selectedDomain?.start.toFixed(2)
            )}
          </Typography>
        </div>
        <div className="flex w-1/2 justify-between">
          <Typography className="text-muted-foreground" variant={'small-medium'}>
            Upper Strike
          </Typography>
          <Typography variant={'small-medium'}>
            {isMemePair ? (
              <>
                <NumberDisplay
                  showDecimalZerosSubscript
                  precision={displayValuesUsd ? 7 : 10}
                  value={displayValuesUsd ? (selectedDomain?.end ?? 0) * quoteAssetPriceUsd : selectedDomain?.end}
                  format={displayValuesUsd ? 'usd' : 'tokenAmount'}
                />
                {!displayValuesUsd && ` ${putToken.symbol}`}
              </>
            ) : (
              selectedDomain?.end?.toFixed(2)
            )}
          </Typography>
        </div>
      </div>

      {selectedDomain && selectedDomain.start < markPrice ? (
        <div className="flex items-center space-x-1">
          <div className="flex w-1/2 items-center space-x-1 bg-subtle/30 px-1 py-[7px]">
            <ArrowBottomRightIcon className="mr-md h-4 w-4 text-destructive" />
            <Typography variant="small-medium">
              {isMemePair ? (
                <>
                  <NumberDisplay
                    showDecimalZerosSubscript
                    precision={displayValuesUsd ? 7 : 10}
                    value={displayValuesUsd ? (selectedDomain?.start ?? 0) * quoteAssetPriceUsd : selectedDomain?.start}
                    format={displayValuesUsd ? 'usd' : 'tokenAmount'}
                  />
                  {' - '}
                  {markPrice > selectedDomain.end ? (
                    <NumberDisplay
                      showDecimalZerosSubscript
                      precision={displayValuesUsd ? 7 : 10}
                      value={displayValuesUsd ? (selectedDomain?.end ?? 0) * quoteAssetPriceUsd : selectedDomain?.end}
                      format={displayValuesUsd ? 'usd' : 'tokenAmount'}
                    />
                  ) : (
                    <NumberDisplay
                      showDecimalZerosSubscript
                      precision={displayValuesUsd ? 7 : 10}
                      value={displayValuesUsd ? markPriceUsd : markPrice}
                      format={displayValuesUsd ? 'usd' : 'tokenAmount'}
                    />
                  )}
                </>
              ) : (
                `${selectedDomain.start.toFixed(2)} - ${markPrice > selectedDomain.end ? selectedDomain.end.toFixed(2) : markPrice.toFixed(2)}`
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
                  onClick={() => {
                    handlePutPercentageClick(100);
                  }}
                  size={'sm'}
                  variant={'secondary'}>
                  <Typography variant="extra-small-regular">Max</Typography>
                </Button>
                <div className="pointer-events-none absolute -left-[68px] top-0.5 flex items-center space-x-1 bg-muted opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100 peer-hover:pointer-events-auto">
                  <Button
                    onClick={() => {
                      handlePutPercentageClick(50);
                    }}
                    className="border border-border"
                    size={'sm'}
                    variant={'secondary'}>
                    <Typography variant="extra-small-regular">50%</Typography>
                  </Button>
                  <Button
                    onClick={() => {
                      handlePutPercentageClick(75);
                    }}
                    className="border border-border"
                    size={'sm'}
                    variant={'secondary'}>
                    <Typography variant="extra-small-regular">75%</Typography>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {selectedDomain && selectedDomain.end > markPrice ? (
        <div className="flex items-center space-x-1">
          <div className="flex w-1/2 items-center space-x-1 bg-subtle/30 px-1 py-[7px]">
            <ArrowTopRightIcon className="mr-md h-4 w-4 text-success" />
            <Typography variant="small-medium">
              {isMemePair ? (
                <>
                  {markPrice > selectedDomain.start ? (
                    <NumberDisplay
                      showDecimalZerosSubscript
                      precision={displayValuesUsd ? 7 : 10}
                      value={displayValuesUsd ? markPriceUsd : markPrice}
                      format={displayValuesUsd ? 'usd' : 'tokenAmount'}
                    />
                  ) : (
                    <NumberDisplay
                      showDecimalZerosSubscript
                      precision={displayValuesUsd ? 7 : 10}
                      value={
                        displayValuesUsd ? (selectedDomain?.start ?? 0) * quoteAssetPriceUsd : selectedDomain?.start
                      }
                      format={displayValuesUsd ? 'usd' : 'tokenAmount'}
                    />
                  )}
                  {' - '}
                  <NumberDisplay
                    showDecimalZerosSubscript
                    precision={displayValuesUsd ? 7 : 10}
                    value={displayValuesUsd ? (selectedDomain?.end ?? 0) * quoteAssetPriceUsd : selectedDomain?.end}
                    format={displayValuesUsd ? 'usd' : 'tokenAmount'}
                  />
                </>
              ) : (
                `${markPrice > selectedDomain.start ? markPrice.toFixed(2) : selectedDomain.start.toFixed(2)} - ${selectedDomain.end.toFixed(2)}`
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
                  onClick={() => {
                    handleCallPercentageClick(100);
                  }}
                  size={'sm'}
                  variant={'secondary'}>
                  <Typography variant="extra-small-regular">Max</Typography>
                </Button>
                <div className="pointer-events-none absolute -left-[68px] top-0.5 flex items-center space-x-1 bg-muted opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100 peer-hover:pointer-events-auto">
                  <Button
                    onClick={() => {
                      handleCallPercentageClick(50);
                    }}
                    className="border border-border"
                    size={'sm'}
                    variant={'secondary'}>
                    <Typography variant="extra-small-regular">50%</Typography>
                  </Button>
                  <Button
                    onClick={() => {
                      handleCallPercentageClick(75);
                    }}
                    className="border border-border"
                    size={'sm'}
                    variant={'secondary'}>
                    <Typography variant="extra-small-regular">75%</Typography>
                  </Button>
                </div>
              </div>
            </div>
            {/* <Button
              className="ml-1"
              onClick={() => {
                setLocalCallInputValue(formatUnits(callTokenBalance, callToken.decimals));
                setCallTokenInput(callTokenBalance);
              }}
              size={'md'}
              variant={'secondary'}>
              <Typography variant="extra-small-regular">Max</Typography>
            </Button> */}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RangeSelectorDeposit;
