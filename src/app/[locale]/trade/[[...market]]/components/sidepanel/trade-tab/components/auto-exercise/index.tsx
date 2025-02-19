import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useToggle } from 'react-use';
import { zeroAddress } from 'viem';
import { useAccount, usePublicClient, useReadContract, useWriteContract } from 'wagmi';

import { cn } from '@/utils/styles';

import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Typography } from '@/components/ui/typography';
import TransactionModal, { Transaction, TransactionActionParams } from '@/app/[locale]/components/transaction-modal';

import useStrikesStore from '@/app/[locale]/trade/[[...market]]/hooks/store/useStrikesStore';

import DopexV2OptionMarket from '@/abi/DopexV2OptionMarket';

import { AUTO_EXERCISER_TIME_BASED_BY_CHAIN_ID } from '@/consts/clamm';

const AutoExercise = () => {
  const { selectedMarket } = useStrikesStore();

  const { address } = useAccount();

  const { address: optionMarketAddress, chainId } = selectedMarket;

  const publicClient = usePublicClient();
  const { writeContractAsync, isPending } = useWriteContract({});

  const AUTO_EXERCISER_TIME_BASED_ADDRESS =
    AUTO_EXERCISER_TIME_BASED_BY_CHAIN_ID[chainId as keyof typeof AUTO_EXERCISER_TIME_BASED_BY_CHAIN_ID] ?? zeroAddress;

  const {
    data: isDelegatorApproved,
    refetch,
    isSuccess,
  } = useReadContract({
    abi: DopexV2OptionMarket,
    functionName: 'exerciseDelegator',
    address: optionMarketAddress,
    args: [address || zeroAddress, AUTO_EXERCISER_TIME_BASED_ADDRESS],
  });

  const [checked, setChecked] = useState(false);
  const [toggleAutoExerciser, setToggleAutoExerciser] = useState<boolean | null>(null);
  const [transactionModalOpen, toggleTransactionModal] = useToggle(false);

  const handleToggle = useCallback(
    (checked: boolean) => {
      // if need to update maintain value to be updated, else set to null
      if (checked != isDelegatorApproved) {
        setToggleAutoExerciser(checked);
        toggleTransactionModal();
      }
    },
    [isDelegatorApproved, toggleTransactionModal],
  );

  useEffect(() => {
    if (isSuccess) {
      setChecked(isDelegatorApproved);
    }
  }, [handleToggle, isDelegatorApproved, isSuccess, refetch]);

  const handlAutoExerciser = useCallback(
    async (onSuccessFn?: () => void, onError?: (err: any) => void) => {
      const hash = await writeContractAsync(
        {
          abi: DopexV2OptionMarket,
          functionName: 'updateExerciseDelegate',
          address: optionMarketAddress,
          args: [AUTO_EXERCISER_TIME_BASED_ADDRESS, toggleAutoExerciser!],
        },
        {
          onError: (err) => {
            onError?.(err);
          },
        },
      );

      publicClient
        ?.waitForTransactionReceipt({ confirmations: 2, hash })
        .then((res) => {
          onSuccessFn?.();
        })
        .catch((err) => {
          onError?.(err);
        });
    },
    [AUTO_EXERCISER_TIME_BASED_ADDRESS, optionMarketAddress, publicClient, toggleAutoExerciser, writeContractAsync],
  );

  const transactions = useMemo(
    () => [
      ...(toggleAutoExerciser !== null
        ? [
            {
              description: `${toggleAutoExerciser ? 'Enabling' : 'Disabling'} Auto Exerciser`,
              onAction: ({ onSuccessFn, onError }: TransactionActionParams) => handlAutoExerciser(onSuccessFn, onError),
            },
          ]
        : []),
    ],
    [handlAutoExerciser, toggleAutoExerciser],
  ) as Transaction[];

  return (
    <div className="flex items-center justify-between bg-secondary p-md">
      <div className="flex">
        <Typography className="mr-md text-muted-foreground" variant="small-medium">
          Auto Exercise (<span className={cn({ 'text-accent': !checked })}>{checked ? 'Enabled' : 'Disabled'}</span>)
        </Typography>
        <Tooltip>
          <TooltipTrigger>
            <QuestionMarkCircledIcon className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <div>Options are automatically exercised 5 minutes before expiry.</div>
            <div>Note: There is a 1% fee for auto-exercising.</div>
          </TooltipContent>
        </Tooltip>
      </div>
      <TransactionModal
        onClose={() => {
          toggleTransactionModal();
          refetch();
        }}
        successMsg="Auto-exerciser updated successfully."
        open={transactionModalOpen && transactions.length > 0}
        transactions={transactions}
      />
      <Switch disabled={!address || isPending} checked={checked} onCheckedChange={handleToggle} />
    </div>
  );
};

export default AutoExercise;
