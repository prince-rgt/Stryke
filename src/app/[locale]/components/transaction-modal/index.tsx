import React, { useEffect, useState } from 'react';

import { cn } from '@/utils/styles';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Typography } from '@/components/ui/typography';

import TransactionStepIndicator from '../transaction-modal-uncontrolled/transaction-step-indicator';

export type OnError = (err: any) => void;
export type OnSuccessFn = () => void;

export interface TransactionActionParams {
  onError?: (err: any) => void;
  onSuccessFn?: () => void;
}

export interface Transaction {
  description: string;
  onAction: ({ onError, onSuccessFn }: TransactionActionParams) => Promise<void>;
  inProgress?: boolean;
  inProgressDescription?: string;
}

const TransactionModal = ({
  transactions,
  open,
  successMsg,
  onClose,
}: {
  open: boolean;
  transactions: Transaction[];
  successMsg: string;
  onClose: (complete?: boolean) => void;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);

  const reset = () => {
    setCurrentStep(0);
    setError('');
    setComplete(false);
  };

  useEffect(() => {
    if (open && transactions.length > 0 && currentStep < transactions.length) {
      const currentTransaction = transactions[currentStep];
      currentTransaction.onAction({
        onSuccessFn: () => {
          setError('');
          if (currentStep === transactions.length - 1) {
            setComplete(true);
          }
          setCurrentStep((prevStep) => {
            // console.log({ currentStep, prevStep });
            return prevStep + 1;
          });
        },
        onError: (e) => {
          console.log({ error: e });
          setError(e.shortMessage || 'An error occurred.');
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, open, complete]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          onClose(complete);
          reset();
        }
      }}>
      <DialogContent closeButtonClasses="top-0" className="flex w-fit min-w-[336px] flex-col space-y-md">
        {complete ? (
          <>
            <Typography variant={'p-bold'}>{successMsg || 'Success'}</Typography>{' '}
            <Button
              onClick={() => {
                onClose(complete);
                reset();
              }}>
              Close
            </Button>
          </>
        ) : (
          <>
            <div className="flex flex-col">
              <Typography variant={'p-bold'}>Submitting Transactions</Typography>
              <Typography variant={'small-medium'} className="text-muted-foreground">
                {transactions[currentStep]?.description}
              </Typography>
            </div>
            {error && <Typography className="text-destructive">{error}</Typography>}
            {transactions.length > 1 && (
              <TransactionStepIndicator
                steps={transactions}
                currentStep={currentStep}
                errorStep={error ? currentStep : undefined}
              />
            )}
            <Button
              onClick={() => {
                if (error) {
                  const currentTransaction = transactions[currentStep];
                  currentTransaction.onAction({
                    onSuccessFn: () => {
                      setError('');
                      if (currentStep === transactions.length - 1) {
                        setComplete(true);
                      }
                      setCurrentStep((prevStep) => {
                        // console.log({ currentStep, prevStep });
                        return prevStep + 1;
                      });
                    },
                    onError: (e) => {
                      console.log({ e });
                      setError(e.shortMessage || 'An error occurred.');
                    },
                  });
                }
              }}
              disabled={!error}>
              {error ? 'Try Again' : 'Check Wallet'}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
