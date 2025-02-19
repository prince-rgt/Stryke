import { CaretSortIcon, PlusIcon } from '@radix-ui/react-icons';
import { useCallback, useState } from 'react';
import { checksumAddress } from 'viem';
import { base, blast } from 'viem/chains';
import { useAccount } from 'wagmi';

import { GeneratedStrike } from '@/utils/math/generateStrikes';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import NumberDisplay from '@/components/ui/number-display';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Typography } from '@/components/ui/typography';
import SelectedStrikesInputs from '../../components/selected-strikes-inputs';

import useStrikesStore from '../../../../hooks/store/useStrikesStore';

import { OVERRIDDEN_MARKET_DECIMALS } from '@/consts/clamm';

const StrikeDropdownSelection = ({ generatedStrikes }: { generatedStrikes: GeneratedStrike[] }) => {
  const [selectedSide, setSelectedSide] = useState<'call' | 'put'>('call');
  const {
    markPriceUsd,
    quoteAssetPriceUsd,
    setSelectedStrikes,
    selectedStrikes,
    displayStrikesAsMarketCap,
    selectedMarket,
  } = useStrikesStore();
  const { chainId: userChainId } = useAccount();
  const { circulatingSupply, isMemePair, chainId } = selectedMarket;
  const strikesToShow = generatedStrikes.filter((strike) => strike.type === selectedSide);

  const strikeDecimals = OVERRIDDEN_MARKET_DECIMALS[checksumAddress(selectedMarket.primePool)] ?? 4;

  const handleCheckedChange = useCallback(
    (checked: boolean, strikePrice: number) => {
      if (checked) {
        setSelectedStrikes([...selectedStrikes, strikePrice]);
      } else {
        setSelectedStrikes(selectedStrikes.filter((strike) => strike !== strikePrice));
      }
    },
    [selectedStrikes, setSelectedStrikes],
  );

  const incorectChain = chainId != userChainId;

  // TODO: find why base tokens generate strikes in reverse order
  if (chainId == base.id || chainId == blast.id) {
    strikesToShow.reverse();
  }

  return (
    <div className="flex justify-between py-md">
      <Typography variant="small-medium">Select Strikes</Typography>
      <Popover>
        <PopoverTrigger asChild disabled={incorectChain}>
          <Button className="flex items-center space-x-sm" size={'sm'} variant={'secondary'}>
            <PlusIcon width={16} height={16} />
            <CaretSortIcon width={16} height={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent collisionPadding={8} className="w-[250px] overflow-auto bg-primary p-0" align="start">
          <div className="flex justify-start bg-secondary p-md">
            <ToggleGroup
              value={selectedSide}
              onValueChange={(v: 'call' | 'put') => v && v != selectedSide && setSelectedSide(v)}
              type={'single'}>
              <ToggleGroupItem value="call">Calls</ToggleGroupItem>
              <ToggleGroupItem value="put">Puts</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex max-h-[500px] flex-col space-y-md overflow-auto p-md">
            {(selectedSide == 'put' ? strikesToShow.reverse() : strikesToShow).map((strike) => {
              const strikeUsd = strike.strike * quoteAssetPriceUsd;
              const deltaFromMark = strikeUsd - markPriceUsd;
              const isSelected = selectedStrikes.includes(strike.strike);
              return (
                <div key={strike.strike} className="flex items-center justify-between">
                  <div className="flex items-center space-x-md">
                    <Checkbox onCheckedChange={(v) => handleCheckedChange(!!v, strike.strike)} checked={isSelected} />
                    <Typography variant="small-medium">
                      {displayStrikesAsMarketCap ? (
                        <NumberDisplay precision={4} value={circulatingSupply * strikeUsd} format="usd" />
                      ) : (
                        <NumberDisplay
                          showDecimalZerosSubscript
                          value={strikeUsd}
                          precision={isMemePair ? 7 : strikeDecimals}
                          format="usd"
                        />
                      )}
                    </Typography>
                  </div>
                  <Typography className="text-muted-foreground" variant="small-medium">
                    <NumberDisplay
                      showDecimalZerosSubscript
                      value={displayStrikesAsMarketCap ? deltaFromMark * circulatingSupply : deltaFromMark}
                      precision={7}
                      format="usd"
                    />
                  </Typography>
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const ManualDeposit = ({ generatedStrikes }: { generatedStrikes: GeneratedStrike[] }) => {
  return (
    <SelectedStrikesInputs
      side="lp"
      generatedStrikes={generatedStrikes}
      StrikeDropdownSelection={<StrikeDropdownSelection generatedStrikes={generatedStrikes} />}
    />
  );
};

export default ManualDeposit;
