import { useCallback } from 'react';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Typography } from '@/components/ui/typography';
import Balances from '../components/balances';
import SelectedStrikesInputs from '../components/selected-strikes-inputs';
import AutoExercise from './components/auto-exercise';
import PnlChart from './components/pnl-chart';
import PriceInfoBuy from './components/price-info-buy';

import { EXPIRIES, ExpiryOption, TTL_TO_EXPIRY, useTradeStore } from './hooks/store/useTradeStore';

const TradeTab = () => {
  const { selectedTTL, errors, setSelectedTTL } = useTradeStore();

  const handleToggleChange = useCallback(
    (value: ExpiryOption) => {
      if (value) {
        setSelectedTTL(EXPIRIES[value]);
      }
    },
    [setSelectedTTL],
  );

  return (
    <>
      <div className="flex flex-col space-y-md bg-secondary p-md">
        <div className="flex items-center justify-between">
          <Typography className="text-muted-foreground" variant="small-medium">
            Expiry
          </Typography>
          <ToggleGroup
            defaultValue={ExpiryOption.OneDay}
            type="single"
            value={TTL_TO_EXPIRY[selectedTTL]}
            onValueChange={(value) => handleToggleChange(value as ExpiryOption)}>
            {Object.entries(EXPIRIES).map(([key, _]) => (
              <ToggleGroupItem key={key} value={key}>
                {key}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
      <SelectedStrikesInputs errors={errors} side="trade" />
      <Balances />
      <PriceInfoBuy selectedTTL={selectedTTL} />
      <AutoExercise />
      <PnlChart />
    </>
  );
};

export default TradeTab;
