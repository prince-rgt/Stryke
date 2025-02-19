import { useState } from 'react';
import { useAccount } from 'wagmi';

import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';

import useStrikesStore from '../../../hooks/store/useStrikesStore';
import useDepositsPositionsData from './hooks/useDepositsPositionsData';

import ClaimButton from '../../merkl-claim-button';
import LpPositionsTable from './lp-positions-table';

const LPPositions = () => {
  const { address } = useAccount();
  const { selectedMarket } = useStrikesStore();
  const { depositsData, minLiquidityThresholdUSD, setMinLiquidityThresholdUSD } = useDepositsPositionsData();
  const [minLiquidityThresholdUSDLocal, setMinLiquidityThresholdUSDLocal] = useState<string>(
    minLiquidityThresholdUSD.toString(),
  );

  return (
    <div className="flex h-full flex-col bg-secondary">
      <div className="flex items-center justify-between p-md">
        <div className="flex items-center space-x-md">
          <ClaimButton />
        </div>
        <div className="flex items-center space-x-sm">
          <Typography variant={'small-regular'}>Show positions with liquidity ≥ </Typography>
          <Input
            size={'sm'}
            className="w-10"
            type="number"
            placeholder="0"
            id="minLiquidityThresholdUSD"
            value={minLiquidityThresholdUSDLocal}
            onChange={(e) => {
              let newValue = e.target.value.replace(/,/g, '.');
              if (newValue === '.') {
                newValue = '0.';
              }
              setMinLiquidityThresholdUSDLocal(newValue);

              // apply the new value to the filter
              parseFloat(e.target.value)
                ? setMinLiquidityThresholdUSD(parseFloat(e.target.value))
                : setMinLiquidityThresholdUSD(0);
            }}
          />
          <Typography variant={'small-regular'}>$</Typography>
        </div>
      </div>
      {address ? (
        <LpPositionsTable key={selectedMarket?.address} depositsData={depositsData} />
      ) : (
        <div className="flex w-full items-center justify-center p-lg">
          <Typography> Connect wallet to view your positions</Typography>
        </div>
      )}
    </div>
  );
};

export default LPPositions;
