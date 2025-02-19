import { SupportedXsykChain } from '@/app/[locale]/xsyk/types';
import { useState } from 'react';
import { formatUnits } from 'viem';
import { useChainId } from 'wagmi';

import { getTokenData, getTokenLogoURI } from '@/utils/tokens';
import { getSykConfig } from '@/app/[locale]/xsyk/utils';

import { Button } from '@/components/ui/button';
import TransactionModalUncontrolled from '@/app/[locale]/components/transaction-modal-uncontrolled';
import { InputPanel, PanelInfoRow } from '@/app/[locale]/xsyk/components/common';

import useButtonState from '@/app/[locale]/xsyk/hooks/useButtonState';
import useVestHelper from '@/app/[locale]/xsyk/hooks/useVestHelper';

import { SUPPORTED_XSYK_CHAINS } from '@/app/[locale]/xsyk/consts';

import InfoPanel from '../convert-tab/info-panel';
import DurationSlider from './duration-slider';

const RedeemTab = () => {
  const [amount, setAmount] = useState<string>('0');
  const [sliderValue, setSliderValue] = useState([50]);
  const [period, setPeriod] = useState<Date | undefined>();

  const chainId = useChainId();

  const { syk, xsyk } = getSykConfig(
    chainId && chainId in SUPPORTED_XSYK_CHAINS ? (chainId as SupportedXsykChain) : (42161 as SupportedXsykChain),
  );

  const {
    contractData: { balance: xSykBalance, conversionRate },
    transactions,
    isLoading,
    onTransactionComplete,
  } = useVestHelper({
    period,
    amount,
  });

  const buttonState = useButtonState({
    action: () => {},
    actionLabel: 'Redeem',
    balance: xSykBalance,
    amount,
  });

  return (
    <div className="flex flex-col h-[372px] p-md bg-secondary justify-between">
      <div className="h-[207px] space-y-md">
        <InputPanel
          tokenInfo={{
            balance: xSykBalance ?? BigInt(0),
            imgSrc: getTokenLogoURI(getTokenData({ address: xsyk.address, chainId: chainId as SupportedXsykChain })),
            name: xsyk.symbol,
            decimals: xsyk.decimals,
          }}
          amount={amount}
          setAmount={setAmount}
        />
        <DurationSlider
          sliderValue={sliderValue}
          setSliderValue={setSliderValue}
          period={period}
          setPeriod={setPeriod}
        />
        <InfoPanel i18nKey="xSYK.Redeem" />
      </div>
      <div className="flex flex-col space-y-md">
        <PanelInfoRow
          label="You will receive"
          data={isLoading ? '...' : `${formatUnits(conversionRate, xsyk.decimals)} ${syk.symbol}`}
        />
        <TransactionModalUncontrolled
          successMsg="Transaction successful"
          disabled={buttonState.disabled || !period || isLoading}
          transactions={transactions}
          onClose={(completed) => {
            if (completed) {
              onTransactionComplete();
            }
          }}>
          <Button>{buttonState.label}</Button>
        </TransactionModalUncontrolled>
      </div>
    </div>
  );
};

export default RedeemTab;
