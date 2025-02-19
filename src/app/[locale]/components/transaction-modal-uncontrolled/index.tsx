import * as Sentry from '@sentry/nextjs';
import { has } from 'lodash';
import React, { cloneElement, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { useToggle } from 'react-use';
import { WaitForTransactionReceiptParameters } from 'viem';
import { useAccount, usePublicClient, useWriteContract } from 'wagmi';

import { bigIntSerializer, generateTenderlySimulationLink } from './utils';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Typography } from '@/components/ui/typography';

import { errorMessages } from './consts';

import TransactionStepIndicator from './transaction-step-indicator';

export type OnError = (err: any) => void;
export type OnSuccessFn = () => void;

export interface TransactionActionParams {
  onError?: OnError;
  onSuccessFn: OnSuccessFn;
}
export type WriteContractParameters = Parameters<ReturnType<typeof useWriteContract>['writeContractAsync']>;

export type Transaction = {
  description: React.ReactNode;
  enabled?: boolean;
  txParams: WriteContractParameters;
  waitForTransactionReceiptParams?: Partial<WaitForTransactionReceiptParameters>;
};

interface TransactionModalProps {
  transactions: Transaction[];
  successMsg: string;
  children: ReactElement;
  onClose?: (complete?: boolean) => void;
  disabled?: boolean;
}

const TransactionModalUncontrolled: React.FC<TransactionModalProps> = ({
  transactions: _transactions,
  successMsg,
  onClose,
  children,
  disabled: _disabled,
}) => {
  const [open, toggleOpen] = useToggle(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);
  const transactions = _transactions.filter((t) => t.enabled === undefined || t.enabled);
  const transactionsRef = useRef<Transaction[]>([]);
  const disabled = transactions.length === 0 || _disabled;

  const { writeContractAsync, isPending } = useWriteContract({});
  const publicClient = usePublicClient();
  const { address: userAddress, chainId } = useAccount();

  const triggerElement = cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      children.props.onClick?.(e);
      toggleOpen(true);
    },
    disabled: children.props.disabled || disabled,
  });

  const reset = () => {
    setCurrentStep(0);
    setError('');
    setComplete(false);
    transactionsRef.current = [];
  };

  const handleTransaction = useCallback(async () => {
    const transactions = transactionsRef.current;

    if (currentStep >= transactions.length) return;

    const currentTransaction = transactions[currentStep];
    const { txParams, waitForTransactionReceiptParams } = currentTransaction;

    const onSuccessFn = () => {
      setError('');
      if (currentStep === transactions.length - 1) {
        setComplete(true);
      } else {
        setCurrentStep((prevStep) => prevStep + 1);
      }
    };

    const getErrorMessage = (error: any) => {
      const errorString =
        typeof error?.shortMessage === 'string'
          ? error?.shortMessage
          : typeof error?.message === 'string'
            ? error?.message
            : '';

      if (errorString) {
        const match = errorString.match(/(0x[a-f0-9]{8})/i);
        if (match) {
          const [errorHash] = match;
          return has(errorMessages, errorHash)
            ? `Reverted with error: ${errorMessages[errorHash]}`
            : `Unknown error: ${errorHash}`;
        }
      }

      return error?.shortMessage || error?.message || 'An error occurred.';
    };

    const onError = (e: any) => {
      console.error('Transaction error:', e);
      setError(getErrorMessage(e));
    };

    const [_params, options] = txParams;

    const customError = async (err: any) => {
      if (err?.cause?.name !== 'UserRejectedRequestError') {
        try {
          const tenderlyLink = await generateTenderlySimulationLink({
            userAddress,
            chainId,
            publicClient: publicClient!,
            txParams: { ..._params, args: _params.args as any[] },
            value: txParams[0].value || 0n,
          });
          // console.log('Tenderly simulation link:', tenderlyLink);
          // Log to Sentry
          Sentry.captureMessage(err, {
            extra: {
              transactionDetails: JSON.parse(JSON.stringify(txParams[0], bigIntSerializer)),
              tenderlySimulationLink: tenderlyLink,
            },
            fingerprint: ['transaction_error', txParams[0].functionName],
            tags: {
              errorType: 'transaction_error',
            },
          });
        } catch (linkError) {
          console.error('Failed to generate Tenderly simulation link:', linkError);
        }
      }

      onError(
        //@ts-ignore
        options?.onError?.(err) ?? err,
      );
    };
    const hash = await writeContractAsync(_params, { ...options, onError: customError });
    publicClient
      ?.waitForTransactionReceipt({ confirmations: 2, hash, retryCount: 10, ...waitForTransactionReceiptParams })
      .then((res) => {
        onSuccessFn();
      })
      .catch((err) => {
        onError?.(err);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, open, complete]);

  useEffect(() => {
    if (open && transactionsRef.current.length === 0) {
      transactionsRef.current = transactions;
    }
    const _transactions = transactionsRef.current.length > 0 ? transactionsRef.current : transactions;
    if (open && _transactions.length > 0 && currentStep < _transactions.length && !complete) {
      handleTransaction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, open, complete]);

  return (
    <>
      {triggerElement}
      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (!open) {
            onClose?.(complete);
            reset();
            toggleOpen(false);
          }
        }}>
        <DialogContent closeButtonClasses="top-0" className="flex w-fit min-w-[336px] flex-col space-y-md">
          {complete ? (
            <>
              <Typography variant={'p-bold'}>{successMsg || 'Success'}</Typography>{' '}
              <Button
                onClick={() => {
                  onClose?.(complete);
                  reset();
                  toggleOpen(false);
                }}>
                Close
              </Button>
            </>
          ) : (
            <>
              <div className="flex flex-col">
                <Typography variant={'p-bold'}>Submitting Transactions</Typography>
                <Typography variant={'small-medium'} className="text-muted-foreground">
                  {transactionsRef.current[currentStep]?.description}
                </Typography>
              </div>
              {error && <Typography className="text-destructive">{error}</Typography>}
              {transactionsRef.current.length > 1 && (
                <TransactionStepIndicator
                  steps={transactionsRef.current}
                  currentStep={currentStep}
                  errorStep={error ? currentStep : undefined}
                />
              )}
              <Button
                onClick={() => {
                  if (error) {
                    handleTransaction();
                  }
                }}
                disabled={!error || isPending}>
                {error && !isPending ? 'Try Again' : 'Check Wallet'}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionModalUncontrolled;
