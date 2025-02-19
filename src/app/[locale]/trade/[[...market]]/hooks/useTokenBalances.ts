import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, erc20Abi, formatUnits, zeroAddress } from 'viem';
import { useAccount, useReadContracts } from 'wagmi';

import useStrikesStore from './store/useStrikesStore';

// refetch interval in seconds
const REFETCH_INTERVAL = 5;

export interface TokenBalances {
  callToken: bigint;
  putToken: bigint;
  readableCallToken: string;
  readablePutToken: string;
  callTokenSymbol: string;
  putTokenSymbol: string;
}

const useTokenBalances = ({ allowanceContract = zeroAddress }: { allowanceContract?: Address }) => {
  const [tokenBalances, setTokenBalances] = useState<TokenBalances>();
  const { address: user = zeroAddress } = useAccount();

  const { selectedMarket } = useStrikesStore();

  const { pair, chainId } = selectedMarket;
  const callToken = pair?.[0];
  const putToken = pair?.[1];
  const { data: balances = [], refetch: refetchBalances } = useReadContracts({
    contracts: [
      {
        address: callToken?.address ?? zeroAddress,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [user],
        chainId,
      },
      {
        address: putToken?.address ?? zeroAddress,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [user],
        chainId,
      },
    ],
  });

  const {
    data: tokenAllowances,
    refetch: refetchAllowances,
    isError: allowanceFetchError,
  } = useReadContracts({
    contracts: [
      {
        abi: erc20Abi,
        address: callToken?.address ?? zeroAddress,
        functionName: 'allowance',
        args: [user, allowanceContract],
        chainId,
      },
      {
        abi: erc20Abi,
        address: putToken?.address ?? zeroAddress,
        functionName: 'allowance',
        args: [user, allowanceContract],
        chainId,
      },
    ],
  });

  const allowances = useMemo(() => {
    if (!tokenAllowances) {
      return {
        callToken: BigInt(0),
        putToken: BigInt(0),
      };
    }
    return {
      callToken: tokenAllowances[0].result ? BigInt(tokenAllowances[0].result) : BigInt(0),
      putToken: tokenAllowances[1].result ? BigInt(tokenAllowances[1].result) : BigInt(0),
    };
  }, [tokenAllowances]);

  const updateTokenBalances = useCallback(async () => {
    if (!selectedMarket || !user || !balances[0] || !balances[1]) return;

    if (!callToken || !putToken) return;

    const callTokenBalance = balances[0].result ? BigInt(balances[0].result) : BigInt(0);
    const putTokenBalance = balances[1].result ? BigInt(balances[1].result) : BigInt(0);
    const readableCallToken = formatUnits(callTokenBalance, callToken.decimals);
    const readablePutToken = formatUnits(putTokenBalance, putToken.decimals);
    setTokenBalances({
      callToken: callTokenBalance,
      putToken: putTokenBalance,
      readableCallToken,
      readablePutToken,
      callTokenSymbol: callToken.symbol,
      putTokenSymbol: putToken.symbol,
    });
  }, [selectedMarket, user, balances, callToken, putToken]);

  useEffect(() => {
    updateTokenBalances();

    const interval = setInterval(() => {
      refetchBalances();
    }, REFETCH_INTERVAL * 1000);

    return () => clearInterval(interval);
  }, [refetchBalances, updateTokenBalances]);

  return { tokenBalances, refetchBalances, updateTokenBalances, allowances, refetchAllowances, allowanceFetchError };
};

export default useTokenBalances;
