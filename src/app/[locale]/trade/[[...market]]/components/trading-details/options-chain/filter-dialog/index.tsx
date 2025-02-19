import { CrossCircledIcon, MixerHorizontalIcon, WidthIcon } from '@radix-ui/react-icons';
import { sortBy } from 'lodash';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import NumberDisplay from '@/components/ui/number-display';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Typography } from '@/components/ui/typography';

import useStrikesStore from '../../../../hooks/store/useStrikesStore';

import RangeSelector, { Domain } from '../../../range-selector';

const FilterDialog = () => {
  const { strikes, markPrice, filterSettings: _filterSettings, selectedMarket, setFilterSettings } = useStrikesStore();

  const filterSettings = useMemo(
    () =>
      _filterSettings[selectedMarket?.address?.toLowerCase()] || {
        minStrike: 0,
        maxStrike: Infinity,
        optionsAmountThreshold: 0,
        usdThreshold: 0,
        liquidityThresholdType: 'intraday',
      },
    [_filterSettings, selectedMarket?.address],
  );

  const [liquidityThresholdType, setLiquidityThresholdType] = useState<'weekly' | 'intraday'>(
    filterSettings.liquidityThresholdType || 'intraday',
  );

  const { minStrike, maxStrike, optionsAmountThreshold, usdThreshold } = filterSettings;
  const [type, setType] = useState<'USD' | 'Options'>(optionsAmountThreshold > 0 ? 'Options' : 'USD');
  const [thresholdAmount, setThresholdAmount] = useState(
    type === 'Options' ? optionsAmountThreshold.toString() : usdThreshold.toString(),
  );

  const [minStrikeInput, setMinStrikeInput] = useState(minStrike || 0);
  const [maxStrikeInput, setMaxStrikeInput] = useState(maxStrike || Infinity);

  // Effect to update local state when selectedMarket changes
  useEffect(() => {
    setMinStrikeInput(filterSettings.minStrike || 0);
    setMaxStrikeInput(filterSettings.maxStrike || Infinity);
    setLiquidityThresholdType(filterSettings.liquidityThresholdType || 'intraday');
    setType(filterSettings.optionsAmountThreshold > 0 ? 'Options' : 'USD');
    setThresholdAmount(
      filterSettings.optionsAmountThreshold > 0
        ? filterSettings.optionsAmountThreshold.toString()
        : filterSettings.usdThreshold.toString(),
    );
  }, [selectedMarket?.address, filterSettings]);

  const rangeSelectorData = useMemo(
    () =>
      sortBy(strikes, 'strikePrice').map((strike) =>
        liquidityThresholdType === 'intraday'
          ? {
              strikePrice: strike.strikePrice,
              value: strike.availableLiquidity.amountUSD,
              liquidityUsd: strike.availableLiquidity.amountUSD,
              optionsAmount:
                strike.strikePrice > markPrice
                  ? strike.availableLiquidity.amountToken
                  : strike.availableLiquidity.amountToken / strike.strikePrice,
            }
          : {
              strikePrice: strike.strikePrice,
              value: strike.availableLiquidityWeekly.amountUSD,
              liquidityUsd: strike.availableLiquidityWeekly.amountUSD,
              optionsAmount:
                strike.strikePrice > markPrice
                  ? strike.availableLiquidityWeekly.amountToken
                  : strike.availableLiquidityWeekly.amountToken / strike.strikePrice,
            },
      ),

    [liquidityThresholdType, markPrice, strikes],
  );

  const filteredStrikes = useMemo(() => {
    const thresholdAmountNumber = Number(thresholdAmount);

    return rangeSelectorData.filter(({ liquidityUsd, optionsAmount }) => {
      if (type === 'USD') {
        return liquidityUsd > thresholdAmountNumber;
      } else {
        return optionsAmount > thresholdAmountNumber;
      }
    });
  }, [rangeSelectorData, thresholdAmount, type]);

  const handleChangeThresholdAmount = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (newValue === '.') {
      newValue = '0.';
    }
    setThresholdAmount(newValue);
  }, []);

  const onDomainChange = (domain?: Domain) => {
    if (!domain) return;
    setMinStrikeInput(domain.start);
    setMaxStrikeInput(domain.end);
  };

  const reset = useCallback(() => {
    setThresholdAmount('0');
    setMinStrikeInput(0);
    setMaxStrikeInput(Infinity);
  }, []);

  const handleApply = useCallback(() => {
    setFilterSettings(selectedMarket.address.toLowerCase(), {
      maxStrike: maxStrikeInput,
      minStrike: minStrikeInput,
      optionsAmountThreshold: type === 'Options' ? Number(thresholdAmount) : 0,
      usdThreshold: type === 'USD' ? Number(thresholdAmount) : 0,
      liquidityThresholdType,
    });
  }, [
    liquidityThresholdType,
    maxStrikeInput,
    minStrikeInput,
    selectedMarket.address,
    setFilterSettings,
    thresholdAmount,
    type,
  ]);

  const isRangeSelected =
    rangeSelectorData.length !== 0 &&
    ((minStrike !== 0 && minStrike !== filteredStrikes[0]?.strikePrice) ||
      (maxStrike && maxStrike !== Infinity && maxStrike !== filteredStrikes[filteredStrikes.length - 1]?.strikePrice));

  const handleRangeReset = useCallback(() => {
    setFilterSettings(selectedMarket.address.toLowerCase(), {
      ...filterSettings,
      maxStrike: Infinity,
      minStrike: 0,
    });
  }, [filterSettings, selectedMarket.address, setFilterSettings]);

  const handleOptionsAmountReset = useCallback(() => {
    setFilterSettings(selectedMarket.address.toLowerCase(), {
      ...filterSettings,
      optionsAmountThreshold: 0,
    });
  }, [filterSettings, selectedMarket.address, setFilterSettings]);

  const handleUsdAmountReset = useCallback(() => {
    setFilterSettings(selectedMarket.address.toLowerCase(), {
      ...filterSettings,
      usdThreshold: 0,
    });
  }, [filterSettings, selectedMarket.address, setFilterSettings]);

  return (
    <div className="flex items-center space-x-md">
      <Dialog>
        <DialogTrigger className="items-center">
          <Button className="flex items-center text-foreground/80 hover:text-foreground" variant={'ghost'} size={'sm'}>
            <MixerHorizontalIcon className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="flex max-w-[452px] flex-col p-0">
          <Typography variant={'p-bold'}>Filter Options Chain</Typography>
          <Typography className="mb-md text-muted-foreground" variant={'small-medium'}>
            Customize strikes displayed on the options chain.
          </Typography>
          <Typography className="mb-sm" variant={'small-medium'}>
            Available Liquidity Type
          </Typography>
          <ToggleGroup
            value={liquidityThresholdType}
            type="single"
            className="mb-md self-start"
            onValueChange={(value: 'intraday' | 'weekly') => value && setLiquidityThresholdType(value)}>
            <ToggleGroupItem value={'intraday'}>Intraday</ToggleGroupItem>
            <ToggleGroupItem value={'weekly'}>Weekly</ToggleGroupItem>
          </ToggleGroup>
          <Typography variant={'small-medium'}>Liquidity Threshold</Typography>
          <Typography className="text-muted-foreground" variant={'small-medium'}>
            Use a threshold value to filter out strikes based on available liquidity
          </Typography>
          <div className="mb-md flex items-center justify-between space-x-1">
            <ToggleGroup
              size={'md'}
              value={type}
              type="single"
              onValueChange={(value: 'USD' | 'Options') => value && setType(value)}>
              <ToggleGroupItem value={'USD'}>USD</ToggleGroupItem>
              <ToggleGroupItem value={'Options'}>Options</ToggleGroupItem>
            </ToggleGroup>
            <Input
              autoFocus
              type="number"
              value={thresholdAmount === '0' ? '' : thresholdAmount}
              onChange={handleChangeThresholdAmount}
              placeholder="Enter value"
            />
          </div>
          <Typography variant={'small-medium'}>Strike Range</Typography>
          <Typography className="text-muted-foreground" variant={'small-medium'}>
            Adjust the sliders below to show strikes according to your preferred range
          </Typography>
          <div className="-mx-2">
            <RangeSelector
              // initialSelectedDomain={{ start: minStrike, end: maxStrike }}
              onDomainChange={onDomainChange}
              markPrice={markPrice}
              data={filteredStrikes}
            />
          </div>
          <Button onClick={reset} className="mb-md w-fit" variant={'secondary'}>
            Reset to Defaults
          </Button>
          <div className="flex w-full space-x-md">
            <DialogClose className="w-full">
              <Button className="w-full" variant={'secondary'}>
                Cancel
              </Button>
            </DialogClose>
            <DialogClose className="w-full">
              <Button className="w-full" onClick={handleApply}>
                Apply
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
      {isRangeSelected && (
        <div className="text-light-grey flex h-6 items-center justify-center rounded-sm bg-muted pl-md text-xs font-medium">
          <NumberDisplay showDecimalZerosSubscript value={minStrike} format="usd" />
          <WidthIcon className="mx-0.5 text-muted-foreground" />
          <NumberDisplay
            showDecimalZerosSubscript
            value={maxStrike ? maxStrike : filteredStrikes[filteredStrikes.length - 1].strikePrice}
            format="usd"
          />
          <Button onClick={handleRangeReset} className="mx-1 h-5 px-1" variant={'ghost'}>
            <CrossCircledIcon />
          </Button>
        </div>
      )}
      {optionsAmountThreshold !== 0 && (
        <div className="text-light-grey flex h-6 items-center justify-center rounded-sm bg-muted pl-md text-xs font-medium">
          Avail. Options ≥ {optionsAmountThreshold}
          <Button onClick={handleOptionsAmountReset} className="mx-1 h-5 px-1" variant={'ghost'}>
            <CrossCircledIcon />
          </Button>
        </div>
      )}
      {usdThreshold !== 0 && (
        <div className="text-light-grey flex h-6 items-center justify-center rounded-sm bg-muted pl-md text-xs font-medium">
          Avail. USD ≥ ${usdThreshold}
          <Button onClick={handleUsdAmountReset} className="mx-1 h-5 px-1" variant={'ghost'}>
            <CrossCircledIcon />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterDialog;
