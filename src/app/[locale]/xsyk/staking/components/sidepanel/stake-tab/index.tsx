'use client';

import { SupportedXsykChain } from '@/app/[locale]/xsyk/types';
import { useMemo, useState } from 'react';
import { erc20Abi, formatUnits, parseEther, parseUnits } from 'viem';
import { useAccount, useChainId, useReadContracts } from 'wagmi';

import { getSykConfig } from '@/app/[locale]/xsyk/utils';

import { Button } from '@/components/ui/button';
import { formatForDisplay } from '@/components/ui/number-display';
import TransactionModalUncontrolled, { Transaction } from '@/app/[locale]/components/transaction-modal-uncontrolled';
import { InputPanel, PanelInfoRow } from '@/app/[locale]/xsyk/components/common';

import useButtonState from '@/app/[locale]/xsyk/hooks/useButtonState';
import useXSykStaking from '@/app/[locale]/xsyk/staking/hooks/useXSykStaking';

import xSykStakingAbi from '@/abi/xStrykeStakingAbi';

import { SUPPORTED_XSYK_CHAINS } from '@/app/[locale]/xsyk/consts';

const StakeTab = () => {
  const [amount, setAmount] = useState<string>('0');

  const { address: user = '0x' } = useAccount();
  const chainId = useChainId();

  const { xsyk, xsykStaking } = getSykConfig(
    chainId && chainId in SUPPORTED_XSYK_CHAINS ? (chainId as SupportedXsykChain) : (42161 as SupportedXsykChain),
  );

  const { stakedBalance, totalSupply, apr } = useXSykStaking();
  const { data = [], refetch } = useReadContracts({
    contracts: [
      {
        abi: erc20Abi,
        address: xsyk.address,
        functionName: 'balanceOf',
        args: [user],
      },
      {
        abi: erc20Abi,
        address: xsyk.address,
        functionName: 'allowance',
        args: [user, xsykStaking],
      },
    ],
  });

  const buttonState = useButtonState({
    action: () => {},
    actionLabel: 'Stake',
    amount,
    balance: data[0]?.result,
  });

  const newUserShare = useMemo(() => {
    const numerator = stakedBalance + parseUnits(amount, xsyk.decimals);
    if (totalSupply === 0n) return '100.00';

    return formatForDisplay({
      value: Math.min(
        (Number(formatUnits(numerator, 18)) / Number(formatUnits(totalSupply + parseEther(amount), 18))) * 100,
        100,
      ),
      format: 'tokenAmount',
      precision: 2,
    });
  }, [amount, stakedBalance, totalSupply, xsyk]);

  const transactions = useMemo(() => {
    const txs: Transaction[] = [];
    if (data[1]?.result !== undefined && data[1]?.result < parseUnits(amount, xsyk.decimals)) {
      txs.push({
        description: 'Approve xSYK',
        txParams: [
          {
            abi: erc20Abi,
            address: xsyk.address,
            functionName: 'approve',
            args: [xsykStaking, parseUnits(amount, xsyk.decimals)],
          },
        ],
      });
    }
    txs.push({
      description: 'Stake xSYK',
      txParams: [
        {
          abi: xSykStakingAbi,
          address: xsykStaking,
          functionName: 'stake',
          args: [parseUnits(amount, xsyk.decimals), BigInt(chainId), user],
        },
      ],
    });
    return txs;
  }, [data, amount, xsyk, xsykStaking, chainId, user]);

  return (
    <div className="flex flex-col justify-between p-md space-y-[11px] h-full">
      <InputPanel
        tokenInfo={{
          balance: data[0]?.result ?? BigInt(0),
          imgSrc: '/images/tokens/xsyk.svg',
          name: xsyk.symbol,
          decimals: xsyk.decimals,
        }}
        amount={amount}
        setAmount={setAmount}
      />
      <div className="flex flex-col space-y-[11px]">
        <PanelInfoRow
          label="New Staked Balance"
          data={`${formatForDisplay({ value: Number(formatUnits(stakedBalance + parseEther(amount), xsyk.decimals)), format: 'tokenAmount', precision: 2 })} xSYK`}
        />
        <PanelInfoRow label="New Share" data={`${newUserShare}%`} />
        <PanelInfoRow label="Est. APR" data={`${apr.toFixed(2)}%`} />
        <TransactionModalUncontrolled
          successMsg="Successfully staked xSYK"
          disabled={buttonState.disabled}
          transactions={transactions}
          onClose={() => {
            refetch();
          }}>
          <Button>{buttonState.label}</Button>
        </TransactionModalUncontrolled>
      </div>
    </div>
  );
};

export default StakeTab;
