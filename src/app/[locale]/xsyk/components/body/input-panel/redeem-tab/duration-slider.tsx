'use client';

import { SupportedXsykChain } from '@/app/[locale]/xsyk/types';
import { format } from 'date-fns';
import { ChevronsUpDownIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { useChainId, useReadContract } from 'wagmi';

import { cn } from '@/utils/styles';
import { getSykConfig } from '@/app/[locale]/xsyk/utils';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Typography } from '@/components/ui/typography';

import xStrykeTokenAbi from '@/abi/xStrykeTokenAbi';

import { SUPPORTED_XSYK_CHAINS } from '@/app/[locale]/xsyk/consts';

type Props = {
  sliderValue: number[];
  setSliderValue: React.Dispatch<React.SetStateAction<number[]>>;
  period: Date | undefined;
  setPeriod: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

const DurationSlider = (props: Props) => {
  const { sliderValue, setSliderValue, period, setPeriod } = props;

  const chainId = useChainId();

  const { xsyk } = getSykConfig(
    chainId && chainId in SUPPORTED_XSYK_CHAINS ? (chainId as SupportedXsykChain) : (42161 as SupportedXsykChain),
  );

  const { data: redeemSettings = null } = useReadContract({
    abi: xStrykeTokenAbi,
    address: xsyk.address,
    functionName: 'redeemSettings',
  });

  const disabled: { lower: DateRange; upper: DateRange } = useMemo(() => {
    const now = new Date();
    if (!redeemSettings) return { lower: { from: now, to: now }, upper: { from: now, to: now } };
    return {
      lower: {
        from: new Date(0),
        to: new Date(now.getTime() + Number(redeemSettings[2]) * 1000),
      },
      upper: {
        from: new Date(now.getTime() + Number(redeemSettings[3]) * 1000),
        to: new Date(now.getTime() * 100),
      },
    };
  }, [redeemSettings]);

  // used for -/+ buttons
  const oneDayInSliderTerms = useMemo(() => {
    if (!redeemSettings || !redeemSettings[3] || !redeemSettings[2] || !period) return 0;

    const range = Number(redeemSettings[3] - redeemSettings[2]);

    return (86400 / range) * 100;
  }, [period, redeemSettings]);

  const sliderBounds = useMemo(() => {
    if (!redeemSettings) return { min: 4.046, max: 104.046 }; // 4.046 is 1 week in %
    return {
      min: (Number(redeemSettings[2]) / Math.max(Number(redeemSettings[3] - redeemSettings[2]), 1)) * 100,
      max: (Number(redeemSettings[3]) / Math.max(Number(redeemSettings[3] - redeemSettings[2]), 1)) * 100,
    };
  }, [redeemSettings]);

  const convertSliderToPeriod = useCallback(
    (v: number[]) => {
      setSliderValue(() => v);
      if (!redeemSettings || !redeemSettings[3] || !redeemSettings[2]) return;

      const slideRatio = v[0] / 100; // slider range (0, 1)
      const validRange = Number(redeemSettings[3]) * 1000; // in milliseconds
      const selectedRange = Math.max(slideRatio * validRange, Number(redeemSettings[2]));
      const nowInMs = Math.floor(new Date().getTime());

      setPeriod(() => new Date(nowInMs + selectedRange));
    },
    [redeemSettings, setPeriod, setSliderValue],
  );

  const convertPeriodToSlider = useCallback(
    (d: Date | undefined) => {
      setPeriod(d);

      if (!redeemSettings || !redeemSettings[3] || !redeemSettings[2] || !period || !d) return;

      const minDuration = Number(redeemSettings[2]) * 1000;
      const maxDuration = Number(redeemSettings[3]) * 1000;
      const range = Math.abs(maxDuration - minDuration);

      const nowInMs = new Date().getTime(); // in milliseconds
      const selectedPeriodInMs = d.getTime();

      const selectedDuration = selectedPeriodInMs - (nowInMs + minDuration);

      setSliderValue(() => [(selectedDuration / range) * 100]);
    },
    [period, redeemSettings, setPeriod, setSliderValue],
  );

  return (
    <div className="flex flex-col space-y-lg">
      <Typography variant="small-medium">Vesting Period</Typography>
      <div className="grid grid-flow-col grid-rows-1 grid-cols-12 gap-lg">
        <Button variant="secondary" onClick={(_) => convertSliderToPeriod([sliderBounds.min])}>
          <Typography variant="small-medium">Min</Typography>
        </Button>
        <Button
          variant="secondary"
          onClick={(_) => convertSliderToPeriod([Math.max(sliderValue[0] - oneDayInSliderTerms, sliderBounds.min)])}>
          <MinusIcon height={16} width={16} />
        </Button>
        <div className={cn('grid gap-2', 'col-span-8')}>
          <Popover>
            <PopoverTrigger asChild className="flex justify-between w-full">
              <Button
                id="date"
                variant="ghost"
                className={cn(
                  'w-full text-xs justify-between text-center font-normal bg-muted',
                  !period && 'text-muted-foreground',
                )}>
                {period ? format(period, 'LLL dd, y') : <span>Pick a date</span>}
                <ChevronsUpDownIcon className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                disabled={[disabled.lower, disabled.upper]}
                mode="single"
                selected={period}
                onSelect={convertPeriodToSlider}
                numberOfMonths={1}
                fixedWeeks
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button
          variant="secondary"
          onClick={() => convertSliderToPeriod([Math.min(sliderValue[0] + oneDayInSliderTerms, 100)])}>
          <PlusIcon height={16} width={16} />
        </Button>
        <Button variant="secondary" onClick={(_) => convertSliderToPeriod([sliderBounds.max])}>
          <Typography variant="small-medium">Max</Typography>
        </Button>
      </div>
      <Slider
        className="col-span-8"
        value={sliderValue}
        onValueChange={convertSliderToPeriod}
        min={sliderBounds.min}
        max={sliderBounds.max}
        step={0.1}
      />
    </div>
  );
};

export default DurationSlider;
