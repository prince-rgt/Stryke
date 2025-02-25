'use client';

import { SupportedXsykChain } from '@/app/[locale]/xsyk/types';
import Image from 'next/image';
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

import { BTC } from '@/assets/images';

import { SUPPORTED_XSYK_CHAINS } from '@/app/[locale]/xsyk/consts';

const DepositForm = () => {
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
    <div className="justify-between p-sm h-full">
      {/* Form */}
      <div className="bg-[#2C2C2C] p-4 mb-20">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <p>Deposit</p>
            <input
              type="number"
              placeholder="0.00"
              className="bg-transparent text-2xl placeholder:text-muted-foreground text-white font-medium max-w-32"
            />
          </div>
          <div className="flex items-center justify-center gap-1 bg-[#3C3C3C] rounded px-3 h-9 text-sm text-white">
            <Image src={BTC} alt="" className="size-6" />
            <span>WBTC</span>
          </div>
        </div>
        <div className="flex justify-between w-full my-2">
          <p> ≈ $ {0} </p>
          <p className="flex gap-2">
            <span>Balance: </span>
            <span className="text-white"> {0.31} Max</span>
          </p>
        </div>
      </div>

      {/* Additonal Info */}
      <div className="flex justify-between my-2">
        <p>Entry epoch</p>
        <p className="text-white">Epoch 3 (Feb 15, 2025)</p>
      </div>
      <div className="flex justify-between my-2">
        <p>Starts In</p>
        <p className="text-[#EBFF00]">5D 12H 30M</p>
      </div>

      {/* Withdrawal Info Box */}
      <div className="p-3 bg-gradient-to-l from-[#2C2C2C] from-30% to-[#EBFF0000] text-medium border border-white/20 rounded">
        <h1 className="text-white mb-3 text-md">Withdrawal Instructions</h1>
        <p>
          Your deposit will be queued for <span className="text-[#EBFF00]">Epoch 3</span>. Funds will automatically roll
          into future epochs unless you queue a withdrawal before the epoch ends.
        </p>
      </div>

      <div className="flex flex-col mt-3 text-sm">
        <Button disabled>Enter Amount</Button>
      </div>
    </div>
  );
};

export default DepositForm;
