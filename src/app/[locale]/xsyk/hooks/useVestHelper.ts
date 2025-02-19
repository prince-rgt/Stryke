import { useCallback, useMemo } from 'react';
import { erc20Abi, parseUnits } from 'viem';
import { useAccount, useReadContract, useReadContracts } from 'wagmi';

import { getSykConfig } from '../utils';

import { Transaction } from '../../components/transaction-modal-uncontrolled';

import xStrykeTokenAbi from '@/abi/xStrykeTokenAbi';

import { DEFAULT_CHAIN_ID } from '@/consts/chains';
import { SUPPORTED_XSYK_CHAINS } from '../consts';

import { SupportedXsykChain } from '../types';
import useXSykData from './useXSykData';

type Props = {
  amount: string;
  period: Date | undefined;
};

const useVestHelper = (props: Props) => {
  const { amount, period = new Date() } = props;
  const { address: user = '0x', chainId = DEFAULT_CHAIN_ID } = useAccount();
  const { refetch: refetchPositions } = useXSykData();

  const { syk, xsyk } = getSykConfig(
    chainId && chainId in SUPPORTED_XSYK_CHAINS ? (chainId as SupportedXsykChain) : (42161 as SupportedXsykChain),
  );

  const { data: balance = 0n, refetch: refetchBalance } = useReadContract({
    abi: erc20Abi,
    address: xsyk.address,
    functionName: 'balanceOf',
    args: [user],
  });

  const { data = [], isLoading } = useReadContracts({
    query: {
      refetchInterval: 1000,
      refetchIntervalInBackground: true,
    },
    contracts: [
      {
        abi: erc20Abi,
        address: xsyk.address,
        functionName: 'allowance',
        args: [user, xsyk.address],
      },
      {
        abi: xStrykeTokenAbi,
        address: xsyk.address,
        functionName: 'redeemSettings',
      },
      {
        abi: xStrykeTokenAbi,
        address: xsyk.address,
        functionName: 'getSykByVestingDuration',
        args: [parseUnits(amount, xsyk.decimals), BigInt(Math.ceil((period.getTime() - new Date().getTime()) / 1000))],
      },
    ],
  });

  const contractData = useMemo(() => {
    return {
      balance,
      allowance: data[1]?.result,
      redeemSettings: {
        minRatio: data[1]?.result?.[0],
        maxRatio: data[1]?.result?.[1],
        minPeriod: data[1]?.result?.[2],
        maxPeriod: data[1]?.result?.[3],
      },
      conversionRate: data[2]?.result ?? BigInt(0),
    };
  }, [data, balance]);

  const transactions = useMemo(() => {
    if (!period) return [];

    const selectedDuration = Math.max(Math.ceil((period.getTime() - new Date().getTime()) / 1000), 86400 * 7);

    return [
      {
        description: 'Vest SYK from xSYK. Note that your SYK will be cliff vested at maturity.',
        txParams: [
          {
            abi: xStrykeTokenAbi,
            address: xsyk.address,
            functionName: 'vest',
            args: [parseUnits(amount, syk.decimals), BigInt(selectedDuration)],
          },
        ],
      },
    ] as Transaction[];
  }, [amount, period, syk, xsyk]);

  const onTransactionComplete = useCallback(() => {
    refetchPositions();
    refetchBalance();
  }, [refetchBalance, refetchPositions]);

  return {
    contractData,
    transactions,
    isLoading,
    onTransactionComplete,
  };
};

export default useVestHelper;
