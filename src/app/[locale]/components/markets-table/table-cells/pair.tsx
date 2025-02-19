import { MarketData } from '@/types';

import TokenPair from '@/app/[locale]/components/token-pair';

const PairCell = ({ pair }: { pair: MarketData['pair'] }) => {
  return (
    <div className="p-md">
      <TokenPair pair={pair} />
    </div>
  );
};

export default PairCell;
