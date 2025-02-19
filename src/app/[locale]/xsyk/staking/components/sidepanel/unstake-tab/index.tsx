'use client';

import { SupportedXsykChain } from '@/app/[locale]/xsyk/types';
import { useMemo, useState } from 'react';
import { formatEther, formatUnits, parseUnits } from 'viem';
import { useAccount, useChainId } from 'wagmi';

import { getSykConfig } from '@/app/[locale]/xsyk/utils';

import { Button } from '@/components/ui/button';
import { formatForDisplay } from '@/components/ui/number-display';
import TransactionModalUncontrolled, { Transaction } from '@/app/[locale]/components/transaction-modal-uncontrolled';
import { InputPanel, PanelInfoRow } from '@/app/[locale]/xsyk/components/common';

import useXSykStaking from '../../../hooks/useXSykStaking';
import useButtonState from '@/app/[locale]/xsyk/hooks/useButtonState';

import xSykStakingAbi from '@/abi/xStrykeStakingAbi';

import { SUPPORTED_XSYK_CHAINS } from '@/app/[locale]/xsyk/consts';

const UnstakeTab = () => {
  const [amount, setAmount] = useState<string>('0');

  const { address: user = '0x' } = useAccount();
  const chainId = useChainId();
  const { xsyk, xsykStaking } = getSykConfig(
    chainId && chainId in SUPPORTED_XSYK_CHAINS ? (chainId as SupportedXsykChain) : (42161 as SupportedXsykChain),
  );

  const { stakedBalance, totalSupply, refetchStakedBalance, refetchTotalStaked, apr } = useXSykStaking();

  const buttonState = useButtonState({
    action: () => {},
    actionLabel: 'Unstake',
    amount,
    balance: stakedBalance,
  });

  const newUserShare = useMemo(() => {
    const diff = stakedBalance - parseUnits(amount, xsyk.decimals);
    const numerator = diff < 0n ? 0n : diff;
    if (totalSupply === 0n) return '0.00';

    return formatForDisplay({
      value: Math.min((Number(formatEther(numerator)) / Number(formatEther(totalSupply + 1n))) * 100, 100),
      format: 'tokenAmount',
      precision: 2,
    });
  }, [amount, stakedBalance, totalSupply, xsyk]);

  const transactions = useMemo(() => {
    if (stakedBalance === 0n) return [];

    return [
      {
        description: 'Unstake xSYK',
        txParams: [
          {
            abi: xSykStakingAbi,
            address: xsykStaking,
            functionName: 'unstake',
            args: [parseUnits(amount, 18), BigInt(chainId), user],
          },
        ],
      },
    ] as Transaction[];
  }, [amount, chainId, stakedBalance, user, xsykStaking]);

  return (
    <div className="flex flex-col justify-between p-md space-y-[11px] h-full">
      <InputPanel
        tokenInfo={{
          balance: stakedBalance ?? BigInt(0),
          imgSrc: '/images/tokens/xsyk.svg',
          name: xsyk.symbol,
          decimals: xsyk.decimals,
        }}
        amount={amount}
        setAmount={setAmount}
      />
      <div className="flex flex-col space-y-[11px]">
        <PanelInfoRow
          label="Total"
          data={`${formatForDisplay({ value: Number(formatUnits(totalSupply, xsyk.decimals)), format: 'tokenAmount', precision: 2 })}`}
        />
        <PanelInfoRow label="New Share" data={`${newUserShare}%`} />
        <PanelInfoRow label="Est. APR" data={`${apr.toFixed(2)}%`} />
        <TransactionModalUncontrolled
          successMsg="Successfully unstaked xSYK"
          disabled={buttonState.disabled}
          transactions={transactions}
          onClose={() => {
            refetchTotalStaked();
            refetchStakedBalance();
          }}>
          <Button disabled={buttonState.disabled}>{buttonState.label}</Button>
        </TransactionModalUncontrolled>
      </div>
    </div>
  );
};

export default UnstakeTab;
