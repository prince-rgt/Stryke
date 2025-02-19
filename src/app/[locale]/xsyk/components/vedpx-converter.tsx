'use client';

import { useMemo } from 'react';
import { erc20Abi, formatEther, zeroAddress } from 'viem';
import { useAccount, useReadContracts } from 'wagmi';

import { Button } from '@/components/ui/button';
import NumberDisplay from '@/components/ui/number-display';
import { Typography } from '@/components/ui/typography';
import TransactionModalUncontrolled, { Transaction } from '@/app/[locale]/components/transaction-modal-uncontrolled';

import sykMigratorAbi from '@/abi/sykMigratorAbi';
import veDPXAbi from '@/abi/veDPXAbi';
import xStrykeTokenAbi from '@/abi/xStrykeTokenAbi';

import {
  CONVERSION_RATIOS_BIGINT,
  DPX_ADDRESS,
  MIGRATOR_ADDRESS,
  SYK_ADDRESS,
  XSYK_ADDRESS,
} from '@/app/[locale]/migrate/consts';
import { VEDPX } from '@/app/[locale]/xsyk/consts';

const VedpxConverter = () => {
  const { address: userAddress = zeroAddress, chainId } = useAccount();

  const reads = useReadContracts({
    contracts: [
      { abi: veDPXAbi, address: VEDPX, functionName: 'balanceOf', args: [userAddress] },
      { abi: veDPXAbi, address: VEDPX, functionName: 'locked', args: [userAddress] },
    ],
  });

  const { lockedDpx, sykToMigrate } = useMemo(() => {
    if (reads.isSuccess && chainId === 42161) {
      return {
        vedpxBalance: reads.data[0].result!,
        lockedDpx: reads.data[1].result![0],
        sykToMigrate: (CONVERSION_RATIOS_BIGINT.dpx * reads.data[1].result![0]) / 10000n,
      };
    } else {
      return {
        vedpxBalance: 0n,
        lockedDpx: 0n,
        sykToMigrate: 0n,
      };
    }
  }, [reads, chainId]);

  const transactions = useMemo(
    () => [
      {
        description: 'Unlock your veDPX',
        txParams: [
          {
            abi: veDPXAbi,
            address: VEDPX,
            functionName: 'withdraw',
            args: [],
          },
        ],
      },
      {
        description: 'Approve DPX',
        txParams: [
          {
            abi: erc20Abi,
            address: DPX_ADDRESS,
            functionName: 'approve',
            args: [MIGRATOR_ADDRESS, lockedDpx],
          },
        ],
      },
      {
        description: 'Migrate DPX',
        txParams: [
          {
            abi: sykMigratorAbi,
            address: MIGRATOR_ADDRESS,
            functionName: 'migrate',
            args: [DPX_ADDRESS, lockedDpx],
          },
        ],
      },
      {
        description: 'Approve SYK',
        txParams: [
          {
            abi: erc20Abi,
            address: SYK_ADDRESS,
            functionName: 'approve',
            args: [XSYK_ADDRESS, sykToMigrate],
          },
        ],
      },
      {
        description: 'Convert',
        txParams: [
          {
            abi: xStrykeTokenAbi,
            address: XSYK_ADDRESS,
            functionName: 'convert',
            args: [sykToMigrate, userAddress],
          },
        ],
      },
    ],
    [lockedDpx, sykToMigrate, userAddress],
  ) as Transaction[];

  return lockedDpx > 0n ? (
    <div className="bg-alert-gradient p-4 justify-self-end">
      <Typography variant="small-medium" className="my-auto mb-4 text-foreground">
        Convert your veDPX
      </Typography>
      <Typography variant="small-medium" className="my-auto mb-4 text-muted-foreground">
        You have <NumberDisplay value={Number(formatEther(lockedDpx))} format="tokenAmount" /> veDPX, convert it to xSYK
        below.
      </Typography>
      <TransactionModalUncontrolled transactions={transactions} successMsg="Success!!">
        <Button>Convert</Button>
      </TransactionModalUncontrolled>
    </div>
  ) : null;
};

export default VedpxConverter;
