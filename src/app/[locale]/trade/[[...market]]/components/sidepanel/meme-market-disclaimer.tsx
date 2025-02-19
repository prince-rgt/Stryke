import { Typography } from '@/components/ui/typography';

import { SIDE_PANEL_WIDTH } from '.';

const MemeMarketDisclaimer = () => {
  return (
    <div className={'flex flex-col space-y-[10px] bg-secondary p-md'} style={{ width: SIDE_PANEL_WIDTH }}>
      <Typography className="p-bold">Disclaimer ⚠️</Typography>
      <Typography className="small-regular">
        The USD values for strike being displayed are dynamic and will vary based on the price of ETH.
      </Typography>
      <Typography className="small-regular">
        While exercising a large position you may face high slippage due to the low liquidity affecting realised PNL.
      </Typography>
    </div>
  );
};

export default MemeMarketDisclaimer;
