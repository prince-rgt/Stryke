import { SupportedXsykChain } from '@/app/[locale]/xsyk/types';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo } from 'react';
import { formatUnits } from 'viem';
import { useChainId, useWriteContract } from 'wagmi';

import { getSykConfig } from '@/app/[locale]/xsyk/utils';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { formatForDisplay } from '@/components/ui/number-display';
import { Typography } from '@/components/ui/typography';

import useXSykData from '@/app/[locale]/xsyk/hooks/useXSykData';

import xStrykeTokenAbi from '@/abi/xStrykeTokenAbi';

import { SUPPORTED_XSYK_CHAINS } from '@/app/[locale]/xsyk/consts';

type Props = {
  vestIndex: string;
  xSykAmount: string;
};

const CancelDialog = ({ vestIndex, xSykAmount }: Props) => {
  const t = useTranslations('xSYK.Redeem.CancelDialog');
  const { writeContractAsync, status } = useWriteContract();

  const chainId = useChainId();

  const { xsyk, syk } = getSykConfig(
    chainId && chainId in SUPPORTED_XSYK_CHAINS ? (chainId as SupportedXsykChain) : (42161 as SupportedXsykChain),
  );

  const { refetch: refetchUserXSykData } = useXSykData();

  const handleCancel = useCallback(async () => {
    await writeContractAsync({
      abi: xStrykeTokenAbi,
      address: xsyk.address,
      functionName: 'cancelVest',
      args: [BigInt(vestIndex)],
    }).then(() => refetchUserXSykData());
  }, [refetchUserXSykData, vestIndex, writeContractAsync, xsyk]);

  const buttonState = useMemo(() => {
    switch (status) {
      case 'idle':
        return { label: 'Confirm', disabled: false };
      case 'success':
        return { label: 'Cancelled', disabled: true };
      case 'pending':
        return { label: 'Cancelling...', disabled: true };
      default:
        return { label: 'Confirm', disabled: false };
    }
  }, [status]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          Cancel
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col space-y-[0px] max-h-[80vh] max-w-[366px]">
        <DialogHeader>
          <Typography variant="p-bold">{t('Title')}</Typography>
        </DialogHeader>
        <Typography variant="small-medium" className="text-muted-foreground">
          {t('Body', {
            xSykAmount: formatForDisplay({
              value: Number(formatUnits(BigInt(xSykAmount), syk.decimals)),
              format: 'tokenAmount',
            }),
          })}
        </Typography>
        <div className="flex w-full space-x-2">
          <DialogClose className="w-1/2">
            <Button variant="secondary" className="w-full">
              {t('Close')}
            </Button>
          </DialogClose>
          <Button variant="accent" onClick={handleCancel} disabled={buttonState.disabled} className="w-1/2">
            {buttonState.label}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelDialog;
