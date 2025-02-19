import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { useTimeframeStore } from '@/app/[locale]/leaderboard/hooks/useTimeframeStore';

import { TimeFrame } from '@/app/[locale]/leaderboard/consts';

const Timeframes = ({ isLoading }: { isLoading: boolean }) => {
  const { timeframe, setTimeframe } = useTimeframeStore();

  return (
    <ToggleGroup
      type="single"
      disabled={isLoading}
      value={timeframe}
      onValueChange={(v: TimeFrame) => v && setTimeframe(v)}
      defaultValue={TimeFrame.OneDay}>
      <ToggleGroupItem value={TimeFrame.OneDay}>{TimeFrame.OneDay}</ToggleGroupItem>
      <ToggleGroupItem value={TimeFrame.OneWeek}>{TimeFrame.OneWeek}</ToggleGroupItem>
      <ToggleGroupItem value={TimeFrame.OneMonth}>{TimeFrame.OneMonth}</ToggleGroupItem>
      <ToggleGroupItem value={TimeFrame.SixMonths}>{TimeFrame.SixMonths}</ToggleGroupItem>
    </ToggleGroup>
  );
};

export default Timeframes;
