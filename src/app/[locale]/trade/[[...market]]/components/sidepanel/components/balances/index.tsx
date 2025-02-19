import { useEffect } from 'react';

import NumberDisplay from '@/components/ui/number-display';
import { Typography } from '@/components/ui/typography';

import useTokenBalancesStore from '../../../../hooks/store/useTokenBalancesStore';
import useTokenBalances from '../../../../hooks/useTokenBalances';

const Balances = () => {
  const { tokenBalances, refetchBalances } = useTokenBalances({});
  const setRefetchTokenBalances = useTokenBalancesStore((state) => state.setRefetchTokenBalances);

  useEffect(() => {
    setRefetchTokenBalances(refetchBalances);
  }, [setRefetchTokenBalances, refetchBalances]);

  const { readableCallToken, readablePutToken, callTokenSymbol, putTokenSymbol } = tokenBalances ?? {};
  return (
    <div className="flex items-center justify-between bg-secondary p-md">
      <Typography className="text-muted-foreground" variant="small-medium">
        Balances
      </Typography>

      <div className="flex items-center justify-center space-x-1 text-sm">
        <Typography variant="small-medium">
          <NumberDisplay value={Number(readableCallToken)} precision={4} format="tokenAmount" />
          {` ${callTokenSymbol}`}
        </Typography>
        <Typography variant="small-medium">
          <NumberDisplay value={Number(readablePutToken)} precision={4} format="tokenAmount" />
          {` ${putTokenSymbol}`}
        </Typography>
      </div>
    </div>
  );
};

export default Balances;
