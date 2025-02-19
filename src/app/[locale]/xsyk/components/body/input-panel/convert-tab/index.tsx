import { SupportedXsykChain } from '@/app/[locale]/xsyk/types';
import { useMemo, useState } from 'react';
import { erc20Abi, parseUnits } from 'viem';
import { useAccount, useReadContracts, useWriteContract } from 'wagmi';

import { getTokenData, getTokenLogoURI } from '@/utils/tokens';
import { getSykConfig } from '@/app/[locale]/xsyk/utils';

import { Button } from '@/components/ui/button';
import TransactionModalUncontrolled, { Transaction } from '@/app/[locale]/components/transaction-modal-uncontrolled';
import { InputPanel, PanelInfoRow } from '@/app/[locale]/xsyk/components/common';

import useButtonState from '@/app/[locale]/xsyk/hooks/useButtonState';

import xStrykeTokenAbi from '@/abi/xStrykeTokenAbi';

import { SUPPORTED_XSYK_CHAINS } from '@/app/[locale]/xsyk/consts';

import InfoPanel from './info-panel';

const ConvertTab = () => {
  const [amount, setAmount] = useState<string>('0');

  const { address: user = '0x', chain, chainId } = useAccount();

  const { syk, xsyk } = getSykConfig(
    chainId && chainId in SUPPORTED_XSYK_CHAINS ? (chainId as SupportedXsykChain) : (42161 as SupportedXsykChain),
  );

  const { data = [] } = useReadContracts({
    contracts: [
      {
        abi: erc20Abi,
        address: syk.address,
        functionName: 'balanceOf',
        args: [user],
      },
      {
        abi: erc20Abi,
        address: syk.address,
        functionName: 'allowance',
        args: [user, xsyk.address],
      },
    ],
  });

  const buttonState = useButtonState({
    action: () => {},
    actionLabel: 'Convert',
    balance: data[0]?.result,
    amount,
  });

  const transactions = useMemo(() => {
    const txs: Transaction[] = [];
    if (data[1]?.result !== undefined && data[1]?.result < parseUnits(amount, syk.decimals)) {
      txs.push({
        description: 'Approve SYK',
        txParams: [
          {
            abi: erc20Abi,
            address: syk.address,
            functionName: 'approve',
            args: [xsyk.address, parseUnits(amount, syk.decimals)],
          },
        ],
      });
    }
    txs.push({
      description: 'Convert SYK to xSYK',
      txParams: [
        {
          abi: xStrykeTokenAbi,
          address: xsyk.address,
          functionName: 'convert',
          args: [parseUnits(amount, syk.decimals), user],
        },
      ],
    });
    return txs;
  }, [amount, data, syk, user, xsyk]);

  return (
    <div className="flex flex-col h-[372px] p-md bg-secondary justify-between">
      <div className="h-[207px] space-y-md">
        <InputPanel
          tokenInfo={{
            balance: data[0]?.result ?? BigInt(0),
            imgSrc: getTokenLogoURI(getTokenData({ address: syk.address, chainId: syk.chainId })),
            name: syk.symbol,
            decimals: syk.decimals,
          }}
          amount={amount}
          setAmount={setAmount}
        />
        <InfoPanel i18nKey="xSYK.Convert" />
      </div>
      <div className="flex flex-col space-y-md">
        <PanelInfoRow label="You will receive" data={`${amount} ${xsyk.symbol}`} />
        <PanelInfoRow label="Staking from" data={chain?.name ?? '-'} />
        <TransactionModalUncontrolled
          successMsg="Successfully converted SYK to xSYK"
          disabled={buttonState.disabled}
          transactions={transactions}>
          <Button disabled={buttonState.disabled}>{buttonState.label}</Button>
        </TransactionModalUncontrolled>
      </div>
    </div>
  );
};

export default ConvertTab;
