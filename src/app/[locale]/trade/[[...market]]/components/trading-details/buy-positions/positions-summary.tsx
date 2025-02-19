import { useMemo } from 'react';
import { formatUnits, parseUnits } from 'viem';

import { cn } from '@/utils/styles';

import NumberDisplay from '@/components/ui/number-display';
import { Typography } from '@/components/ui/typography';

import useStrikesStore from '../../../hooks/store/useStrikesStore';
import { BuyPositionType } from './hooks/useBuyPositionsData';

const PositionsSummary = ({ positions }: { positions: BuyPositionType[] }) => {
  const { selectedMarket } = useStrikesStore();
  const { pair } = selectedMarket;
  const callToken = pair[0];

  const { totalPremiumUsd, totalPnlUsd, totalSize } = useMemo(() => {
    const totalPnlUsd = positions.reduce(
      (accumulator, currentValue) => accumulator + Number(currentValue.pnl.pnlUsdValue),
      0,
    );

    const totalSize = positions.reduce((accumulator, currentValue) => {
      return (
        accumulator +
        (currentValue.type.toLowerCase() === 'put'
          ? Number(
              formatUnits(
                (BigInt(currentValue.size) * parseUnits('1', currentValue.token.decimals)) /
                  parseUnits(currentValue.strike.toFixed(18).toString(), currentValue.token.decimals),
                currentValue.token.decimals,
              ),
            )
          : Number(formatUnits(BigInt(currentValue.size), currentValue.token.decimals)))
      );
    }, 0);

    const totalPremiumUsd = positions.reduce(
      (accumulator, currentValue) => accumulator + Number(currentValue.premiumUsdValue),
      0,
    );

    return {
      totalPnlUsd,
      totalSize,
      totalPremiumUsd,
    };
  }, [positions]);

  return (
    <div className="flex h-6 items-center space-x-md rounded-sm bg-primary px-md">
      <div className="flex items-center">
        <Typography className="text-muted-foreground" variant={'small-bold'}>
          Total Profit:
        </Typography>
        <Typography
          className={cn('ml-sm', totalPnlUsd > 0 ? 'text-success' : 'text-destructive')}
          variant={'small-bold'}>
          <NumberDisplay value={totalPnlUsd} format="usd" />
        </Typography>
      </div>
      <div className="flex items-center">
        <Typography className="text-muted-foreground" variant={'small-bold'}>
          Total Premium:
        </Typography>
        <Typography className="ml-sm" variant={'small-bold'}>
          <NumberDisplay value={totalPremiumUsd} format="usd" />
        </Typography>
      </div>
      <div className="flex items-center">
        <Typography className="text-muted-foreground" variant={'small-bold'}>
          Total Size:
        </Typography>
        <Typography className="ml-sm" variant={'small-bold'}>
          <NumberDisplay value={totalSize} format="tokenAmount" /> {callToken.symbol}
        </Typography>
      </div>
    </div>
  );
};

export default PositionsSummary;
