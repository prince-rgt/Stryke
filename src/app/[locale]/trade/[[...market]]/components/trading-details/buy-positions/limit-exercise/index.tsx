import { ArrowBottomRightIcon, ArrowTopRightIcon, Pencil2Icon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
import { formatUnits, hexToBigInt } from 'viem';

import getPriceFromTick from '@/utils/math/getPriceFromTick';
import priceToTick from '@/utils/math/priceToTick';
import { cn } from '@/utils/styles';
import { getTokenLogoURI } from '@/utils/tokens';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import NumberDisplay from '@/components/ui/number-display';
import { Typography } from '@/components/ui/typography';
import TransactionModal from '@/app/[locale]/components/transaction-modal';

import useStrikesStore from '../../../../hooks/store/useStrikesStore';
import { BuyPositionType } from '../hooks/useBuyPositionsData';

import useLimitExercise from './useLimitExercise';

const LimitExercise = ({
  positionData,
  refetchBuyPositions,
}: {
  positionData: BuyPositionType;
  refetchBuyPositions?: () => void;
  displayStrikesAsMarketCap?: boolean;
}) => {
  const { strike, type, optionsAmount } = positionData;
  const { selectedMarket } = useStrikesStore();
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { pair, isMemePair, tickSpacing } = selectedMarket;
  const [callToken, putToken] = pair;

  const token0 = hexToBigInt(callToken.address) < hexToBigInt(putToken.address) ? callToken : putToken;
  const token1 = hexToBigInt(callToken.address) < hexToBigInt(putToken.address) ? putToken : callToken;
  const inversePrice = !(token0.address.toLowerCase() === callToken.address.toLowerCase());

  const isCall = useMemo(() => {
    return type.toLowerCase() === 'call';
  }, [type]);

  const {
    successMessage,
    prevTargetPrice,
    transactions,
    toggleTransactionModal,
    transactionModalOpen,
    targetPrice,
    setTargetPrice,
    handleCancelClick,
    handleCreateClick,
    refetchDelegate,
    minProfit,
  } = useLimitExercise({ positionData });

  const handleTargetPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    if (newValue === '.') {
      newValue = '0.';
    }
    validateInput(newValue);
    setTargetPrice(newValue);
  };

  const readablePnl = useMemo(() => {
    return Math.max(0, Number(formatUnits(minProfit, isCall ? putToken.decimals : callToken.decimals)));
  }, [callToken.decimals, isCall, minProfit, putToken.decimals]);

  const validateInput = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      setError('Please enter a valid number');
    } else if (type === 'call' && numValue <= strike) {
      setError('Target price must be greater than strike price for call options');
    } else if (type === 'put' && numValue >= strike) {
      setError('Target price must be less than strike price for put options');
    } else {
      setError('');
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {prevTargetPrice ? (
        <div className="flex items-center space-x-1">
          <Typography variant={'small-medium'}>
            <NumberDisplay
              precision={isMemePair ? 8 : 4}
              showDecimalZerosSubscript
              value={Number(prevTargetPrice)}
              format="tokenAmount"
            />{' '}
            {putToken.symbol}
          </Typography>
          <DialogTrigger>
            <Button variant={'ghost'} size={'sm'}>
              <Pencil2Icon />
            </Button>
          </DialogTrigger>
        </div>
      ) : (
        <DialogTrigger>
          <Button variant={'secondary'} size={'sm'}>
            Set Target
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="flex flex-col p-0 max-w-[366px]">
        <Typography variant={'p-bold'}>Limit Exercise</Typography>
        <Typography className="text-muted-foreground mb-md" variant={'p-medium'}>
          Your position will automatically exercise when mark price reaches your selected target.
        </Typography>
        <div className="flex flex-col space-y-0.5 mb-md">
          <div className="flex w-full space-x-0.5">
            <div className="bg-secondary w-1/2 p-md items-center justify-center flex-col">
              <Typography className="text-center" variant={'p-bold'}>
                <NumberDisplay
                  showDecimalZerosSubscript
                  precision={isMemePair ? 8 : 4}
                  value={strike}
                  format="tokenAmount"
                />
              </Typography>
              <Typography className="text-muted-foreground text-center" variant={'small-bold'}>
                Strike
              </Typography>
            </div>
            <div className="bg-secondary w-1/2 p-md items-center justify-center flex-col">
              <Typography
                className={cn('text-center', readablePnl > 0 ? 'text-success' : 'text-white')}
                variant={'p-bold'}>
                <NumberDisplay showDecimalZerosSubscript precision={4} value={readablePnl} format="tokenAmount" />
              </Typography>
              <Typography className="text-muted-foreground text-center" variant={'small-bold'}>
                Est PNL ({isCall ? putToken.symbol : callToken.symbol})
              </Typography>
            </div>
          </div>
          <div className="flex w-full space-x-0.5">
            <div className="bg-secondary w-1/2 p-md items-center justify-center flex-col">
              <div className="flex justify-center items-center">
                <Image
                  width={16}
                  height={16}
                  src={getTokenLogoURI(pair[0])}
                  alt={pair[0].symbol}
                  className="w-4 h-4 rounded-full mr-sm"
                />
                <Typography className="text-center" variant={'p-bold'}>
                  <NumberDisplay showDecimalZerosSubscript precision={4} value={optionsAmount} format="tokenAmount" />
                </Typography>
              </div>
              <Typography className="text-muted-foreground text-center" variant={'small-bold'}>
                Size
              </Typography>
            </div>
            <div className="bg-secondary w-1/2 p-md items-center justify-center flex-col">
              <div className="flex justify-center items-center">
                {isCall ? (
                  <ArrowTopRightIcon className="w-4 h-4 text-success mr-sm" />
                ) : (
                  <ArrowBottomRightIcon className="w-4 h-4 text-destructive mr-sm" />
                )}
                <Typography className="uppercase" variant={'p-bold'}>
                  {type}
                </Typography>
              </div>
              <Typography className="text-muted-foreground text-center" variant={'small-bold'}>
                Side
              </Typography>
            </div>
          </div>
        </div>
        <div className="mb-md">
          <Typography className="text-muted-foreground mb-0.5" variant={'small-medium'}>
            Target Price ({putToken.symbol})
          </Typography>
          <Input
            className="w-full"
            type="number"
            value={targetPrice}
            onChange={handleTargetPriceChange}
            placeholder="Enter target price"
          />
          {error && (
            <Typography className="text-destructive mt-1" variant={'small-medium'}>
              {error}
            </Typography>
          )}
        </div>
        <TransactionModal
          onClose={(success) => {
            toggleTransactionModal();
            if (success) {
              setIsDialogOpen(false);
              refetchBuyPositions?.();
              refetchDelegate();
            }
          }}
          successMsg={successMessage}
          open={transactionModalOpen && transactions.length > 0}
          transactions={transactions}
        />
        <div className="flex w-full space-x-md">
          <Button onClick={handleCancelClick} disabled={!prevTargetPrice} className="w-full" variant={'secondary'}>
            Remove Target
          </Button>
          <Button onClick={handleCreateClick} disabled={!Number(targetPrice) || !!error} className="w-full">
            {'Confirm'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LimitExercise;
