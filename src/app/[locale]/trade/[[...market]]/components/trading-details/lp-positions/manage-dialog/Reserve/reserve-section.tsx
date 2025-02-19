import { ClockIcon, SlashIcon } from '@radix-ui/react-icons';
import { useEffect, useMemo, useState } from 'react';
import { Address, encodeAbiParameters, formatUnits, getAddress } from 'viem';
import { arbitrum } from 'viem/chains';
import { useAccount, usePublicClient, useReadContract } from 'wagmi';

import { getAmountsForLiquidity, getLiquidityForAmounts } from '@/utils/math/liquidityAmountMath';
import { getSqrtRatioAtTick } from '@/utils/math/tickMath';
import { cn } from '@/utils/styles';

import { Button } from '@/components/ui/button';
import NumberDisplay from '@/components/ui/number-display';
import { Slider } from '@/components/ui/slider';
import { Typography } from '@/components/ui/typography';
import TransactionModalUncontrolled, { Transaction } from '@/app/[locale]/components/transaction-modal-uncontrolled';

import { FormattedPosition } from '../../hooks/useDepositsPositionsData';
import useManageStore from '../hooks/useManageStore';
import useStrikesStore from '@/app/[locale]/trade/[[...market]]/hooks/store/useStrikesStore';

import DopexV2PositionManager from '@/abi/DopexV2PositionManager';
import UniswapV3SingleTickLiquidityHandlerV2 from '@/abi/UniswapV3SingleTickLiquidityHandlerV2';

import { POOL_TO_ABI, POSITION_MANAGER_ADDRESSES_BY_CHAIN_ID } from '@/consts/clamm';

const ReserveSection = ({ positionData }: { positionData: FormattedPosition }) => {
  const { liquidity, withdraw, newLiquidity } = positionData;
  const [sliderValue, setSliderValue] = useState([30]);
  const { refetch: refetchPosition } = useManageStore();
  const { selectedMarket, markPrice } = useStrikesStore();
  const { chainId, chainName } = selectedMarket;
  const { chainId: userChainId } = useAccount();
  const { tickLower, tickUpper, tokenId, pool, hook, handler } = withdraw;

  const positionManagerAddress =
    POSITION_MANAGER_ADDRESSES_BY_CHAIN_ID[chainId as keyof typeof POSITION_MANAGER_ADDRESSES_BY_CHAIN_ID];

  const ammAbi = POOL_TO_ABI[chainId][getAddress(pool)];

  const publicClient = usePublicClient();

  const { data, refetch } = useReadContract({
    abi: ammAbi,
    address: getAddress(pool),
    functionName: 'slot0',
  });

  const sqrtPriceX96 = BigInt((1 / Math.sqrt(markPrice)) * 2 ** 96); // less accurate compared to data[0]

  // use newLiquidity to calculate the available liquidity to reserve
  const availableToReserve = useMemo(() => {
    return getAmountsForLiquidity(
      data ? data?.[0] : BigInt(sqrtPriceX96),
      getSqrtRatioAtTick(BigInt(tickLower)),
      getSqrtRatioAtTick(BigInt(tickUpper)),
      BigInt(newLiquidity),
    );
  }, [data, newLiquidity, tickLower, tickUpper, sqrtPriceX96]);

  const [amountAvailableToReserve, amountSelectedToReserve] = useMemo(() => {
    const amount0 = BigInt(availableToReserve.amount0) - BigInt(withdraw.amount0);
    const amount1 = BigInt(availableToReserve.amount1) - BigInt(withdraw.amount1);

    const perc = BigInt(sliderValue[0] * 10);

    return [
      {
        amount0,
        amount1,
        amount0Symbol: liquidity.amount0Symbol,
        amount1Symbol: liquidity.amount1Symbol,
        amount0Decimals: liquidity.amount0Decimals,
        amount1Decimals: liquidity.amount1Decimals,
      },
      {
        amount0: (perc * amount0) / BigInt(1000),
        amount1: (perc * amount1) / BigInt(1000),
      },
    ];
  }, [
    availableToReserve.amount0,
    availableToReserve.amount1,
    liquidity.amount0Decimals,
    liquidity.amount0Symbol,
    liquidity.amount1Decimals,
    liquidity.amount1Symbol,
    sliderValue,
    withdraw.amount0,
    withdraw.amount1,
  ]);

  const reserveCallData = useMemo(async () => {
    await refetch();
    if (!data || !positionManagerAddress) return null;

    const liquidityToReserve = getLiquidityForAmounts(
      data[0],
      getSqrtRatioAtTick(BigInt(tickLower)),
      getSqrtRatioAtTick(BigInt(tickUpper)),
      amountSelectedToReserve.amount0,
      amountSelectedToReserve.amount1,
    );
    const shares = await publicClient?.readContract({
      abi: UniswapV3SingleTickLiquidityHandlerV2,
      address: handler as Address,
      functionName: 'convertToShares',
      args: [liquidityToReserve, BigInt(tokenId)],
    });

    if (!shares) return null;

    const reserveData = encodeAbiParameters(
      [
        {
          name: 'pool',
          type: 'address',
        },
        {
          name: 'hook',
          type: 'address',
        },
        {
          name: 'tickLower',
          type: 'int24',
        },
        {
          name: 'tickUpper',
          type: 'int24',
        },
        {
          name: 'shares',
          type: 'uint128',
        },
      ],
      [pool as Address, hook as Address, tickLower, tickUpper, BigInt(shares.toString()) - BigInt(1)],
    );

    return reserveData;
  }, [
    amountSelectedToReserve.amount0,
    amountSelectedToReserve.amount1,
    data,
    handler,
    hook,
    pool,
    positionManagerAddress,
    publicClient,
    refetch,
    tickLower,
    tickUpper,
    tokenId,
  ]);

  const isAmountAvailableToReserveZero =
    amountAvailableToReserve.amount0 === BigInt(0) && amountAvailableToReserve.amount1 === BigInt(0);

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const error = useMemo(
    () => (chainId !== userChainId ? `Switch network to ${chainName}` : null),
    [chainId, chainName, userChainId],
  );

  useEffect(() => {
    const updateTransactions = async () => {
      const reserveCallDataValue = await reserveCallData;
      if (!reserveCallDataValue) {
        setTransactions([]);
        return;
      }

      setTransactions([
        {
          description: 'Reserving liquidity',
          txParams: [
            chainId === arbitrum.id
              ? {
                  abi: DopexV2PositionManager,
                  address: positionManagerAddress,
                  functionName: 'reserveLiquidity',
                  args: [handler, reserveCallDataValue],
                }
              : {
                  abi: UniswapV3SingleTickLiquidityHandlerV2,
                  address: handler as Address,
                  functionName: 'reserveLiquidity',
                  args: [reserveCallDataValue],
                },
            ,
          ],
        },
      ]);
    };

    updateTransactions();
  }, [reserveCallData, handler, positionManagerAddress, chainId]);

  return (
    <div className="relative">
      {isAmountAvailableToReserveZero && (
        <Typography variant={'p-bold'} className="absolute left-1/4 top-[44%]">
          No amount available to reserve
        </Typography>
      )}
      <div
        className={cn('flex flex-col space-y-md', {
          'pointer-events-none blur-md': isAmountAvailableToReserveZero,
        })}>
        <Typography>Select Liqudity to Reserve</Typography>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <Typography>
              <NumberDisplay
                value={Number(formatUnits(amountSelectedToReserve.amount0, amountAvailableToReserve.amount0Decimals))}
                format="tokenAmount"
                precision={7}
              />
              {` ${amountAvailableToReserve.amount0Symbol}`}
            </Typography>
            <Typography>
              <NumberDisplay
                value={Number(formatUnits(amountSelectedToReserve.amount1, amountAvailableToReserve.amount1Decimals))}
                format="tokenAmount"
                precision={7}
              />
              {` ${amountAvailableToReserve.amount1Symbol}`}
            </Typography>
          </div>
          <SlashIcon className="h-6 w-6" />
          <div className="flex flex-col">
            <Typography>
              <NumberDisplay
                value={Number(formatUnits(amountAvailableToReserve.amount0, amountAvailableToReserve.amount0Decimals))}
                format="tokenAmount"
                precision={7}
              />
              {` ${amountAvailableToReserve.amount0Symbol}`}
            </Typography>
            <Typography>
              <NumberDisplay
                value={Number(formatUnits(amountAvailableToReserve.amount1, amountAvailableToReserve.amount1Decimals))}
                format="tokenAmount"
                precision={7}
              />
              {` ${amountAvailableToReserve.amount1Symbol}`}
            </Typography>
          </div>
        </div>

        <Slider value={sliderValue} onValueChange={(v) => setSliderValue(v)} max={100} step={1} />
        <div className="flex flex-col space-y-md rounded-sm bg-alert-gradient p-md">
          <div className="flex items-center space-x-md">
            <ClockIcon />
            <Typography>Cooldown Period</Typography>
          </div>
          <Typography className="text-muted-foreground" variant={'small-medium'}>
            Reserving liquidity cannot be undone. You will need to re-deposit into the same strike. After each reserve
            request there will be a <span className="text-highlight">6 hour cooldown </span> before a new reserve
            request is made to the same deposit. In addition reserved liquidity can only be withdrawn separately later.
          </Typography>
        </div>
        <TransactionModalUncontrolled
          onClose={() => {
            refetchPosition();
          }}
          successMsg="Reserving successful"
          disabled={Boolean(error) || isAmountAvailableToReserveZero || transactions.length === 0}
          transactions={transactions}>
          <Button>{error || 'Reserve Liquidity'}</Button>
        </TransactionModalUncontrolled>
      </div>
    </div>
  );
};

export default ReserveSection;
