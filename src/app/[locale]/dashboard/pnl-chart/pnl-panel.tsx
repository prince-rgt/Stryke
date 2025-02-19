import { TriangleDownIcon, TriangleUpIcon } from '@radix-ui/react-icons';

import { cn } from '@/utils/styles';

import NumberDisplay from '@/components/ui/number-display';
import { Typography } from '@/components/ui/typography';

type Props = {
  difference?: number;
  cumulative?: number;
};
const PnlPanel = ({ difference = 0, cumulative = 1000 }: Props) => {
  return (
    <div className="flex h-fit w-fit items-center space-x-md">
      <Typography variant={'p-medium'} className="space-x-[4px]">
        <NumberDisplay value={cumulative} format="usd" />
      </Typography>
      <Typography
        variant={'small-medium'}
        className={cn(
          'flex items-center justify-center space-x-sm px-md',
          difference > 0 ? 'bg-success' : 'bg-destructive',
        )}>
        {difference > 1 ? (
          <TriangleUpIcon className="h-md text-background" />
        ) : (
          <TriangleDownIcon className="h-md text-background" />
        )}
        <span className="font-mono text-background">
          <NumberDisplay value={difference} format="percent" />
        </span>
      </Typography>
    </div>
  );
};

export default PnlPanel;
