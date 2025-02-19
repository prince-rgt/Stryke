import { useMemo } from 'react';
import { Hex } from 'viem';
import { useAccount } from 'wagmi';

import { Button } from '@/components/ui/button';
import { LoaderPinwheel } from '@/components/ui/loader';
import { Typography } from '@/components/ui/typography';
import TransactionModalUncontrolled, { Transaction } from '@/app/[locale]/components/transaction-modal-uncontrolled';

import useStrikesStore from '../../../hooks/store/useStrikesStore';
import useTokenBalancesStore from '../../../hooks/store/useTokenBalancesStore';

import DopexV2OptionMarket from '@/abi/DopexV2OptionMarket';

const ExerciseButton = ({
  exerciseTxs,
  isPreparing,
  resetExercisePositions,
}: {
  exerciseTxs: Hex[];
  isPreparing: boolean;
  resetExercisePositions: () => void;
}) => {
  const { selectedMarket } = useStrikesStore();
  const { chainId, chainName } = selectedMarket;
  const { chainId: userChainId } = useAccount();
  const { refetchTokenBalances: refetchSidePanelTokenBalances } = useTokenBalancesStore();

  const error = useMemo(
    () => (chainId !== userChainId ? `Switch network to ${chainName}` : null),
    [chainId, chainName, userChainId],
  );
  const exerciseLabel = `Exercise ${exerciseTxs.length && !isPreparing ? `(${exerciseTxs.length})` : ''}`;

  const transactions = useMemo(
    () => [
      {
        enabled: exerciseTxs.length > 0,
        description: `Exercising ${exerciseTxs.length > 1 ? `${exerciseTxs.length} positions` : 'position'}`,
        txParams: [
          {
            abi: DopexV2OptionMarket,
            address: selectedMarket.address,
            functionName: 'multicall',
            args: [exerciseTxs],
          },
          {
            onError: (err: any) => ({
              ...err,
              shortMessage:
                err?.cause?.name == 'UserRejectedRequestError'
                  ? err.shortMessage
                  : (err.shortMessage as string)?.concat(
                      ' Try adjusting the swapper and slippage in exercise settings.',
                    ),
            }),
          },
        ],
      },
    ],
    [exerciseTxs, selectedMarket.address],
  ) as Transaction[];

  return (
    <TransactionModalUncontrolled
      successMsg="Exercise successful"
      onClose={() => {
        refetchSidePanelTokenBalances();
        resetExercisePositions();
      }}
      disabled={Boolean(error) || !exerciseTxs.length || isPreparing}
      transactions={transactions}>
      <Button size={'sm'} variant={'accent'}>
        <Typography variant="small-bold">{error || exerciseLabel}</Typography>
        {isPreparing && <LoaderPinwheel size={16} />}
      </Button>
    </TransactionModalUncontrolled>
  );
};

export default ExerciseButton;
