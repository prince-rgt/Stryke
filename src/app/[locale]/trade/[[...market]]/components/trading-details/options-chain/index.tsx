import { VisibilityState } from '@tanstack/react-table';
import { reduce } from 'lodash';
import { useToggle } from 'react-use';

import { cn } from '@/utils/styles';

import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Typography } from '@/components/ui/typography';

import useStrikesStore from '../../../hooks/store/useStrikesStore';
import useLocalStorage from '@/app/[locale]/hooks/useLocalStorage';

import { ONBOARDING_STEPS_CLASSES } from '../../onboarding-flow/consts';

import ColumnVisibilitySelector from './column-visibility-selector';
import FilterDialog from './filter-dialog';
import { StrikesTable } from './strikes-table';
import { columnIds } from './strikes-table/columns';

const OptionsChain = () => {
  const { displayStrikesAsMarketCap, setDisplayStrikesAsMarketCap, selectedMarket } = useStrikesStore();
  const { isMemePair } = selectedMarket;
  const [callsExpanded, toggleCalls] = useToggle(true);
  const [putsExpanded, togglePuts] = useToggle(true);
  const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>(
    'column-visibility',
    reduce(
      columnIds,
      (result, columnId) => {
        result[columnId] = true;
        return result;
      },
      {} as { [key: string]: boolean },
    ),
  );

  return (
    <div className={cn(ONBOARDING_STEPS_CLASSES['strikesChain'], ' flex h-full flex-col bg-secondary')}>
      <div className="flex items-center justify-between px-md py-[6px]">
        <div className="flex items-center space-x-md">
          <ToggleGroup
            value={[...(callsExpanded ? ['calls'] : []), ...(putsExpanded ? ['puts'] : [])]}
            defaultValue={['calls', 'puts']}
            onValueChange={(v) => {
              v.includes('calls') ? toggleCalls(true) : toggleCalls(false);
              v.includes('puts') ? togglePuts(true) : togglePuts(false);
            }}
            type={'multiple'}>
            <ToggleGroupItem value="calls">Calls</ToggleGroupItem>
            <ToggleGroupItem value="puts">Puts</ToggleGroupItem>
          </ToggleGroup>
          <ColumnVisibilitySelector columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} />
          <FilterDialog />
        </div>
        {isMemePair && (
          <div className="flex items-center space-x-md">
            <Typography variant="small-medium">Display Strikes as Market Cap</Typography>
            <Switch checked={displayStrikesAsMarketCap} onCheckedChange={setDisplayStrikesAsMarketCap} />
          </div>
        )}
      </div>
      <StrikesTable
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        toggles={{
          callsExpanded,
          toggleCalls,
          putsExpanded,
          togglePuts,
        }}
      />
    </div>
  );
};

export default OptionsChain;
