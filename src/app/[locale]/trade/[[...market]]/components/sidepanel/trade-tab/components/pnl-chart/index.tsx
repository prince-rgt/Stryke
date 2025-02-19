import { useMemo } from 'react';
import { formatUnits, parseUnits } from 'viem';

import NumberDisplay from '@/components/ui/number-display';
import { Typography } from '@/components/ui/typography';

import useStrikesStore from '../../../../../hooks/store/useStrikesStore';
import { useTradeStore } from '../../hooks/store/useTradeStore';

import Chart from './chart';

export interface Data {
  price: number;
  pnl: number;
}

const PnlChart = () => {
  const { markPrice, markPriceUsd, quoteAssetPriceUsd, selectedMarket } = useStrikesStore();
  const { inputValues, totalCostUsd } = useTradeStore();

  const data = useMemo(() => {
    if (totalCostUsd === 0) return [];

    const _markPrice = selectedMarket.isMemePair ? markPriceUsd : markPrice;

    const startPoint = _markPrice * 0.7;
    const endPoint = _markPrice * 1.3;

    let step = Math.floor((endPoint + startPoint) / 1000);
    step === 0 ? (step = (endPoint + startPoint) / 1000) : (step = step);

    let data: Data[] = Array.from({ length: 1000 }, (_, i) => {
      const price = Number(startPoint + i * step);
      const calculatePnl = () => {
        let totalPnl = 0;
        inputValues?.forEach(({ token, amount }, strike) => {
          const isPut = strike < markPrice;
          let size = 0;
          let pnlForStrike = 0;

          size += isPut
            ? Number(formatUnits(amount, token.decimals)) / markPrice
            : Number(formatUnits(amount, token.decimals));

          pnlForStrike += (isPut ? -1 : 1) * size * (price - strike * quoteAssetPriceUsd);
          pnlForStrike = pnlForStrike < 0 ? 0 : pnlForStrike;

          totalPnl += pnlForStrike;
        });

        return Number((totalPnl - totalCostUsd).toFixed(2));
      };

      const pnl = calculatePnl();

      return { price, pnl };
    });

    return data;
  }, [totalCostUsd, selectedMarket.isMemePair, markPriceUsd, markPrice, inputValues, quoteAssetPriceUsd]);

  // console.log(data);

  return (
    <div className="border-b border-black">
      <div className="p-md bg-secondary flex flex-col justify-between gap-md">
        <div className="flex">
          <Typography className="mr-md text-muted-foreground" variant="extra-small-regular">
            EST. PROFIT/LOSS
          </Typography>
        </div>
        <div className="overflow-hidden">
          {data.length ? (
            <Chart
              data={data}
              markPrice={selectedMarket.isMemePair ? markPriceUsd : markPrice}
              isMemePair={selectedMarket.isMemePair}
            />
          ) : (
            <Typography
              variant="small-regular"
              className="text-muted-foreground font-mono flex justify-center items-center h-[200px]">
              Select Strikes to View PnL Chart
            </Typography>
          )}
        </div>
        <div className="flex flex-row justify-between">
          <Typography className="text-muted-foreground" variant="extra-small-regular">
            Current Price
          </Typography>
          <Typography variant="small-medium" className="text-success">
            <NumberDisplay
              value={selectedMarket.isMemePair ? markPriceUsd : markPrice}
              precision={selectedMarket.isMemePair ? 6 : 2}
              format="usd"
              showDecimalZerosSubscript
            />
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default PnlChart;
