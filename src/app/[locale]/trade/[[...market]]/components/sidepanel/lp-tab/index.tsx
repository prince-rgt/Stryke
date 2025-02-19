import { BUILD_APP_NAMES } from '@/types';

import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { useEffect, useMemo, useState } from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Typography } from '@/components/ui/typography';
import Balances from '../components/balances';

import useStrikesStore from '../../../hooks/store/useStrikesStore';
import { useLpStore } from './hooks/store/useLpStore';
import useGeneratedStrikes from './hooks/useGeneratedStrikes';

import { AMMs, AMMs_BY_CHAIN_ID, HANDLER_TO_POOLS, SupportedTTLs } from '@/consts/clamm';
import { BUILD_APP_NAME } from '@/consts/env';

import InfoDeposit from './info-deposit';
import ManualDeposit from './manual-deposit';
import RangeSelectorDeposit from './range-selector-deposit';
import SimpleLpMode from './simple-mode';

enum InputMethod {
  Simple = 'SIMPLE',
  Range = 'RANGE',
  Manual = 'MANUAL',
}

const BUILD_APP_OVERRIDE_AMMS: Record<BUILD_APP_NAMES, AMMs[] | null> = {
  // null infers no-override
  [BUILD_APP_NAMES.STRYKE]: null,
  [BUILD_APP_NAMES.KODIAK]: null,
  [BUILD_APP_NAMES.BERACHAIN_TESTNET]: null,
  [BUILD_APP_NAMES.PANCAKESWAP]: [AMMs.PANCAKESWAP],
};

const LpTab = () => {
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.Simple);
  const { selectedMarket, markPrice } = useStrikesStore();
  const { chainId, pairLabel, pair } = selectedMarket;
  const { selectedAMM, setSelectedAMM, ttl, setTTL, setInputValues } = useLpStore();

  const chainAmms = (AMMs_BY_CHAIN_ID as { [key: number]: AMMs[] })[chainId];

  const availableAmms: AMMs[] = useMemo(
    () =>
      BUILD_APP_OVERRIDE_AMMS[BUILD_APP_NAME] !== null
        ? BUILD_APP_OVERRIDE_AMMS[BUILD_APP_NAME]!
        : chainAmms?.filter((amm) => HANDLER_TO_POOLS?.[chainId]?.[amm]?.[pairLabel]),
    [chainAmms, chainId, pairLabel],
  );

  useEffect(() => {
    if (chainId && availableAmms.length) {
      setSelectedAMM(availableAmms[0]);
    }
  }, [availableAmms, chainId, setSelectedAMM]);

  const { generatedStrikes } = useGeneratedStrikes({
    range: inputMethod === InputMethod.Range || inputMethod === InputMethod.Simple ? 300 : 500,
  });

  if (!availableAmms) {
    return null;
  }

  const renderDepositComponent = () => {
    switch (inputMethod) {
      case InputMethod.Simple:
        return <SimpleLpMode generatedStrikes={generatedStrikes} pair={pair} markPrice={markPrice} />;
      case InputMethod.Range:
        return <RangeSelectorDeposit generatedStrikes={generatedStrikes} />;
      case InputMethod.Manual:
        return <ManualDeposit generatedStrikes={generatedStrikes} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between bg-secondary p-md">
        <Typography className="text-muted-foreground" variant={'small-medium'}>
          Input Method
        </Typography>
        <ToggleGroup
          value={inputMethod}
          type="single"
          onValueChange={(value: InputMethod) => value && setInputMethod(value)}>
          <ToggleGroupItem value={InputMethod.Simple}>Simple</ToggleGroupItem>
          <ToggleGroupItem value={InputMethod.Range}>Range</ToggleGroupItem>
          <ToggleGroupItem value={InputMethod.Manual}>Manual</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {renderDepositComponent()}

      <div className="flex flex-col space-y-md bg-secondary p-md">
        <div className="flex items-center justify-between">
          <Typography className="text-muted-foreground" variant={'small-medium'}>
            DEX
          </Typography>
          {availableAmms.length == 1 ? (
            <Typography className="text-foreground" variant={'small-medium'}>
              {availableAmms[0]}
            </Typography>
          ) : (
            <Select value={selectedAMM} onValueChange={(value: AMMs) => setSelectedAMM(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select AMM" />
              </SelectTrigger>
              <SelectContent>
                {availableAmms.map((amm) => (
                  <SelectItem key={amm} value={amm}>
                    {amm}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Typography className="mr-md text-muted-foreground" variant={'small-medium'}>
              Supported Expiry
            </Typography>
            <Tooltip>
              <TooltipTrigger>
                <QuestionMarkCircledIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                Select the TTL of options you want the deposited liquidity to be utilised for.
              </TooltipContent>
            </Tooltip>
          </div>
          <ToggleGroup value={ttl} type="single" onValueChange={(value: SupportedTTLs) => value && setTTL(value)}>
            <ToggleGroupItem value={SupportedTTLs.INTRADAY}>Intraday</ToggleGroupItem>
            <ToggleGroupItem value={SupportedTTLs.WEEKLY}>Weekly</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      <Balances />
      <InfoDeposit />
    </>
  );
};

export default LpTab;
