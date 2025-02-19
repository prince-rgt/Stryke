import { SlashIcon } from '@radix-ui/react-icons';
import React, { useMemo } from 'react';
import { Address, encodeAbiParameters, formatUnits } from 'viem';
import { arbitrum } from 'viem/chains';
import { useAccount } from 'wagmi';

import { cn } from '@/utils/styles';

import { Button } from '@/components/ui/button';
import NumberDisplay from '@/components/ui/number-display';
import { Typography } from '@/components/ui/typography';
import TransactionModalUncontrolled, { Transaction } from '@/app/[locale]/components/transaction-modal-uncontrolled';

import { FormattedPosition } from '../../hooks/useDepositsPositionsData';
import useManageStore from '../hooks/useManageStore';
import useStrikesStore from '@/app/[locale]/trade/[[...market]]/hooks/store/useStrikesStore';
import useTokenBalancesStore from '@/app/[locale]/trade/[[...market]]/hooks/store/useTokenBalancesStore';

import DopexV2PositionManager from '@/abi/DopexV2PositionManager';
import UniswapV3SingleTickLiquidityHandlerV2 from '@/abi/UniswapV3SingleTickLiquidityHandlerV2';

import { POSITION_MANAGER_ADDRESSES_BY_CHAIN_ID } from '@/consts/clamm';

const WithdrawReserved = ({ positionData }: { positionData: FormattedPosition }) => {
  const { reserved, withdraw } = positionData;
  const { refetch: refetchPosition } = useManageStore();
  const { selectedMarket } = useStrikesStore();
  const { chainId, chainName } = selectedMarket;
  const { chainId: userChainId } = useAccount();
  const { refetchTokenBalances: refetchSidePanelTokenBalances } = useTokenBalancesStore();
  const { withdrawable } = reserved;
  const { liquidity } = withdrawable;
  const { tickLower, tickUpper, pool, hook, handler } = withdraw;
  const positionManagerAddress =
    POSITION_MANAGER_ADDRESSES_BY_CHAIN_ID[chainId as keyof typeof POSITION_MANAGER_ADDRESSES_BY_CHAIN_ID];

  const withdrawReservedCallData = useMemo(
    () =>
      encodeAbiParameters(
        [
          { name: 'pool', type: 'address' },
          { name: 'hook', type: 'address' },
          { name: 'tickLower', type: 'int24' },
          { name: 'tickUpper', type: 'int24' },
          { name: 'shares', type: 'uint128' },
        ],
        [pool as Address, hook as Address, tickLower, tickUpper, BigInt(liquidity)],
      ),
    [hook, liquidity, pool, tickLower, tickUpper],
  );

  const transactions = useMemo(
    () => [
      {
        enabled: withdrawReservedCallData !== null,
        description: 'Withdrawing reserved liquidity',
        txParams: [
          chainId === arbitrum.id
            ? {
                abi: DopexV2PositionManager,
                address: positionManagerAddress,
                functionName: 'withdrawReserveLiquidity',
                args: [handler, withdrawReservedCallData],
              }
            : {
                abi: UniswapV3SingleTickLiquidityHandlerV2,
                address: handler as Address,
                functionName: 'withdrawReserveLiquidity',
                args: [withdrawReservedCallData],
              },
          ,
        ],
      },
    ],
    [chainId, handler, positionManagerAddress, withdrawReservedCallData],
  ) as Transaction[];

  const error = useMemo(
    () => (chainId !== userChainId ? `Switch network to ${chainName}` : null),
    [chainId, chainName, userChainId],
  );

  const isReservedAmountToWithdrawZero =
    BigInt(reserved.amount0) === BigInt(0) && BigInt(reserved.amount1) === BigInt(0);

  const isReservedAmountWithrawableZero =
    BigInt(reserved.withdrawable.amount0) === BigInt(0) && BigInt(reserved.withdrawable.amount1) === BigInt(0);

  return (
    <div className="relative">
      {isReservedAmountToWithdrawZero && (
        <Typography variant={'p-bold'} className="absolute top-[32%] left-[14%]">
          No reserved amount available to withdraw
        </Typography>
      )}
      <div
        className={cn('flex flex-col space-y-md', {
          'blur-sm pointer-events-none': isReservedAmountToWithdrawZero,
        })}>
        <Typography>Reserved Amount Available to Withdraw</Typography>
        <div className="flex justify-center">
          <div className="flex flex-col space-y-md">
            {BigInt(reserved.amount0) !== BigInt(0) && (
              <Typography className="flex items-center">
                <NumberDisplay
                  value={Number(formatUnits(BigInt(reserved.withdrawable.amount0), withdraw.amount0Decimals))}
                  format="tokenAmount"
                  precision={7}
                />
                <SlashIcon />
                <NumberDisplay
                  value={Number(formatUnits(BigInt(reserved.amount0), withdraw.amount0Decimals))}
                  format="tokenAmount"
                  precision={7}
                />
                {` ${withdraw.amount0Symbol}`}
              </Typography>
            )}
            {BigInt(reserved.amount1) !== BigInt(0) && (
              <Typography className="flex items-center">
                <NumberDisplay
                  value={Number(formatUnits(BigInt(reserved.withdrawable.amount1), withdraw.amount1Decimals))}
                  format="tokenAmount"
                  precision={7}
                />
                <SlashIcon />
                <NumberDisplay
                  value={Number(formatUnits(BigInt(reserved.amount1), withdraw.amount1Decimals))}
                  format="tokenAmount"
                  precision={7}
                />
                {` ${withdraw.amount1Symbol}`}
              </Typography>
            )}
          </div>
        </div>
        <TransactionModalUncontrolled
          onClose={(complete) => {
            if (complete) {
              refetchPosition();
              refetchSidePanelTokenBalances();
            }
          }}
          successMsg="Withdraw successful"
          disabled={Boolean(error) || isReservedAmountToWithdrawZero || isReservedAmountWithrawableZero}
          transactions={transactions}>
          <Button>{error || 'Withdraw Reserved Liquidity'}</Button>
        </TransactionModalUncontrolled>
      </div>
    </div>
  );
};

export default WithdrawReserved;
