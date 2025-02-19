'use client';

import { useChainModal } from '@rainbow-me/rainbowkit';
import { ArrowDown } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import Countdown from 'react-countdown';
import { erc20Abi, formatEther, getContract, parseEther, zeroAddress } from 'viem';
import { useAccount, usePublicClient, useReadContract, useWalletClient } from 'wagmi';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NumberDisplay from '@/components/ui/number-display';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Typography } from '@/components/ui/typography';

import useTokenData from '../../hooks/useTokenData';

import sykMigratorAbi from '@/abi/sykMigratorAbi';
import xStrykeTokenAbi from '@/abi/xStrykeTokenAbi';

import {
  CONVERSION_RATIOS,
  CONVERSION_RATIOS_BIGINT,
  DPX_ADDRESS,
  MIGRATOR_ADDRESS,
  RDPX_ADDRESS,
  SYK_ADDRESS,
  XSYK_ADDRESS,
} from '../../consts';

// Renderer callback with condition
const renderer = ({
  days,
  hours,
  minutes,
  completed,
}: {
  days: number;
  hours: number;
  minutes: number;
  completed: boolean;
}) => {
  if (completed) {
    return <span className="mx-auto text-destructive mb-4">Migration period has ended.</span>;
  } else {
    return (
      <span className="mx-auto mb-4">
        Migration period ends in{' '}
        <span className="text-highlight">
          {days}d {hours}h {minutes}m
        </span>
      </span>
    );
  }
};

const MigrationPanel = () => {
  const [amount, setAmount] = useState('0');
  const [token, setToken] = useState<'dpx' | 'rdpx'>('dpx');
  const [error, setError] = useState('');
  const [xSykConversionState, setXSykConversionState] = useState({ approved: false, counter: 0, isPending: false });

  const { balances, allowances, refetch: refetchTokenData } = useTokenData();

  const { data: migrationPeriodEnd, isFetched } = useReadContract({
    address: MIGRATOR_ADDRESS,
    abi: sykMigratorAbi,
    functionName: 'migrationPeriodEnd',
    query: {
      staleTime: Infinity,
    },
  });

  const result = useWalletClient();

  const publicClient = usePublicClient();

  const { address: user = zeroAddress, chain } = useAccount();

  const { openChainModal } = useChainModal();

  const handleChange = useCallback(
    (e: { target: { value: string } }) => {
      const _amount = e.target.value;

      setAmount(_amount);

      if (parseEther(_amount) > balances[token]) {
        setError('Not enough balance.');
      } else {
        setError('');
      }
    },
    [balances, token],
  );

  const handleValueChange = useCallback(
    (value: 'dpx' | 'rdpx') => {
      setToken(value);

      if (parseEther(amount) > balances[value]) {
        setError('Not enough balance.');
      } else {
        setError('');
      }
    },
    [amount, balances],
  );

  const handleMax = useCallback(() => {
    setAmount(formatEther(balances[token]));
  }, [balances, token]);

  const handleConvertToSyk = useCallback(async () => {
    const _amount = parseEther(amount);
    const allowance = allowances[token];

    if (_amount <= 0n) {
      setError('Cannot convert 0 amount');
      return;
    }

    const tokenContract = getContract({
      abi: erc20Abi,
      address: token === 'dpx' ? DPX_ADDRESS : RDPX_ADDRESS,
      client: result.data!,
    });

    if (allowance < _amount) {
      try {
        const hash = await tokenContract.write.approve([MIGRATOR_ADDRESS, _amount]);

        await publicClient?.waitForTransactionReceipt({ confirmations: 5, hash });
      } catch {
        return;
      }
    }

    const sykMigratorContract = getContract({ abi: sykMigratorAbi, address: MIGRATOR_ADDRESS, client: result.data! });

    try {
      await sykMigratorContract.write.migrate([token === 'dpx' ? DPX_ADDRESS : RDPX_ADDRESS, _amount]);
      await refetchTokenData();
    } catch {}
  }, [allowances, amount, publicClient, refetchTokenData, result.data, token]);

  const handleConvertToXSyk = useCallback(async () => {
    const _amount = parseEther(amount);
    const tokenAllowance = allowances[token];

    if (_amount <= 0n) {
      setError('Cannot convert 0 amount');
      return;
    }

    setXSykConversionState((s) => ({ ...s, isPending: true }));

    const tokenContract = getContract({
      abi: erc20Abi,
      address: token === 'dpx' ? DPX_ADDRESS : RDPX_ADDRESS,
      client: result.data!,
    });

    if (tokenAllowance < _amount) {
      try {
        const hash = await tokenContract.write.approve([MIGRATOR_ADDRESS, _amount]);
        await publicClient?.waitForTransactionReceipt({ confirmations: 5, hash });

        setXSykConversionState((s) => ({ ...s, counter: 1 }));
      } catch {
        setXSykConversionState((s) => ({ ...s, counter: 0, isPending: false }));
        return;
      }
    }

    const sykMigratorContract = getContract({ abi: sykMigratorAbi, address: MIGRATOR_ADDRESS, client: result.data! });

    try {
      await sykMigratorContract.write.migrate([token === 'dpx' ? DPX_ADDRESS : RDPX_ADDRESS, _amount]);
      setXSykConversionState((s) => ({ ...s, counter: 2 }));
    } catch {
      setXSykConversionState((s) => ({ ...s, counter: 0, isPending: false }));
      return;
    }

    const sykAmount = (_amount * CONVERSION_RATIOS_BIGINT[token]) / 10000n;

    const sykContract = getContract({
      abi: erc20Abi,
      address: SYK_ADDRESS,
      client: result.data!,
    });

    if (allowances.syk < sykAmount) {
      try {
        const hash = await sykContract.write.approve([XSYK_ADDRESS, sykAmount]);
        await publicClient?.waitForTransactionReceipt({ confirmations: 5, hash });

        setXSykConversionState((s) => ({ ...s, counter: 3 }));
      } catch {
        setXSykConversionState((s) => ({ ...s, counter: 0, isPending: false }));
        return;
      }
    }

    const xSykContract = getContract({
      abi: xStrykeTokenAbi,
      address: XSYK_ADDRESS,
      client: result.data!,
    });

    try {
      await xSykContract.write.convert([sykAmount, user]);
      setXSykConversionState((s) => ({ ...s, counter: 0, isPending: false }));
      await refetchTokenData();
    } catch {
      setXSykConversionState((s) => ({ ...s, counter: 0, isPending: false }));
    }
  }, [allowances, amount, publicClient, refetchTokenData, result.data, token, user]);

  if (chain && chain?.id !== 42161)
    return (
      <Button onClick={openChainModal} variant={'secondary'}>
        <Typography>Switch to Arbitrum to Migrate </Typography>
      </Button>
    );

  return (
    <>
      {isFetched ? <Countdown date={new Date(Number(migrationPeriodEnd) * 1000)} renderer={renderer} /> : null}
      <div className="bg-secondary p-3 relative" id="inputs-panel">
        <div className="bg-selected p-2 mb-[1px] rounded-sm">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs text-muted-foreground">Amount</span>
              <Input
                variant="ghost"
                size="lg"
                placeholder="0"
                value={amount}
                onChange={handleChange}
                type="number"
                className="text-lg !p-0 !h-auto"
              />
            </div>
            <Select value={token} onValueChange={handleValueChange}>
              <SelectTrigger className="w-[80px] h-6 p-1">
                <SelectValue className="!text-xs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dpx" className="flex flex-row">
                  <div className="flex items-center">
                    <Image src="/images/tokens/dpx.svg" width={16} height={16} alt="stryke-logo" className="mr-1.5" />
                    <span className="mt-[1px]">DPX</span>
                  </div>
                </SelectItem>
                <SelectItem value="rdpx">
                  <div className="flex items-center">
                    <Image src="/images/tokens/rdpx.svg" width={16} height={16} alt="stryke-logo" className="mr-1.5" />
                    <span className="mt-[1px]">rDPX</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end items-center">
            <div className="flex items-center">
              <span className="text-muted-foreground text-xs">
                Balance: <NumberDisplay format="tokenAmount" value={Number(formatEther(balances[token]))} />
              </span>
              <Button variant="ghost" size="sm" onClick={handleMax}>
                Max
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute border border-primary rounded-sm bg-selected w-fit top-[100px] left-[165px]">
          <ArrowDown width={13} height={13} color="grey" />
        </div>
        <div className="bg-selected p-[1px] rounded-sm">
          <div className="p-2">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground mb-1">You get</span>
                <span className="text-lg font-medium">≈ {CONVERSION_RATIOS[token] * Number(amount)}</span>
              </div>
              <div className="flex rounded-sm bg-muted p-1">
                <Image width={16} height={16} src="/images/tokens/syk.svg" alt="syk" className="mr-1" />
                <span className="text-xs font-medium mt-[0.75px]">SYK</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-secondary p-3 font-medium text-xs grid grid-cols-2 gap-3 items-center" id="output-panel">
        <div>
          <span>1 </span>
          <span className="text-muted-foreground uppercase">DPX = </span>
          <span>{CONVERSION_RATIOS.dpx} </span>
          <span className="text-muted-foreground">SYK</span>
        </div>
        <div>
          <span>1 </span>
          <span className="text-muted-foreground uppercase">rDPX = </span>
          <span>{CONVERSION_RATIOS.rdpx} </span>
          <span className="text-muted-foreground">SYK</span>
        </div>
        <div>
          <span>1 </span>
          <span className="text-muted-foreground uppercase">SYK = </span>
          <span>1 </span>
          <span className="text-muted-foreground">xSYK</span>
        </div>
      </div>
      <div className="bg-secondary p-3 font-medium text-xs flex flex-col space-y-2" id="output-panel">
        <div className="mx-auto text-destructive">{error}</div>
        <div className="flex space-x-2">
          <Button
            size="md"
            className="w-full"
            onClick={handleConvertToXSyk}
            disabled={Boolean(error) || xSykConversionState.isPending}>
            {xSykConversionState.isPending ? `${xSykConversionState.counter}/4` : 'Convert to xSYK'}
          </Button>
          <Button variant="secondary" className="w-full" onClick={handleConvertToSyk} disabled={Boolean(error)}>
            Convert to SYK
          </Button>
        </div>
      </div>
      <div className="bg-secondary p-3 font-medium text-xs flex flex-col space-y-2" id="output-panel">
        <div className="flex items-center space-x-1">
          <span className="text-muted-foreground">Your SYK balance:</span>
          <span>
            <NumberDisplay format="tokenAmount" value={Number(formatEther(balances.syk))} />
          </span>
          <Image width={12} height={12} src="/images/tokens/syk.svg" alt="syk" />
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-muted-foreground">Your xSYK balance:</span>
          <span>
            <NumberDisplay format="tokenAmount" value={Number(formatEther(balances.xsyk))} />
          </span>
          <Image width={12} height={12} src="/images/tokens/xsyk.svg" alt="xsyk" />
        </div>
      </div>
    </>
  );
};

export default MigrationPanel;
