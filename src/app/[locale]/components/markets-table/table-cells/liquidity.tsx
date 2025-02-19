import { MarketData } from '@/types';

import NumberDisplay from '@/components/ui/number-display';
import { Typography } from '@/components/ui/typography';

const LiquidityCell = ({ liquidity }: { liquidity: MarketData['liquidity'] }) => {
  const { availableLiquidity, totalLiquidity } = liquidity;
  return (
    <div className="flex flex-col space-y-0.5 p-md">
      <Typography variant="small-medium">
        <NumberDisplay value={availableLiquidity} format="usd" />{' '}
      </Typography>
      <Typography className="text-muted-foreground" variant="small-medium">
        <NumberDisplay value={totalLiquidity} format="usd" />
      </Typography>
    </div>
  );
};

export default LiquidityCell;
