import PnlHistoryChart from '@/components/charts/pnl-history-chart';
import { Typography } from '@/components/ui/typography';

import { dummyPnlData } from './dummy-data';

type Props = {
  message: string;
};

const WalletNotConnectedPlaceHolder = ({ message }: Props) => {
  return (
    <div className="w-full relative flex items-center justify-center overflow-hidden">
      <PnlHistoryChart className="blur-[5px]" data={dummyPnlData} />
      <div className="flex flex-col items-center justify-center text-center absolute">
        <Typography variant={'p-medium'} className="tracking-wider text-[24px]">
          {message}
        </Typography>
      </div>
    </div>
  );
};

export default WalletNotConnectedPlaceHolder;
